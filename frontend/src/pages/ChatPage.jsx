import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, ArrowLeft, User, Shield, Clock,
    Phone, Video, MoreVertical, Check, CheckCheck, RefreshCw, Zap
} from 'lucide-react';

import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { sendMessage as apiSendMessage } from '../services/api';

const ChatPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const messagesEndRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchConversations();
    }, [user, navigate]);

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId);
        }
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const field = user.role === 'doctor' ? 'doctor_id' : 'patient_id';
            const q = query(collection(db, "conversations"), where(field, "==", user.uid || user.id));

            // Listen to conversations in real-time
            onSnapshot(q, (snapshot) => {
                const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by last message time
                convs.sort((a, b) => {
                    const timeA = a.last_message_at?.toMillis ? a.last_message_at.toMillis() : 0;
                    const timeB = b.last_message_at?.toMillis ? b.last_message_at.toMillis() : 0;
                    return timeB - timeA;
                });

                setConversations(convs);

                if (conversationId) {
                    const active = convs.find(c => c.id === conversationId);
                    setActiveConversation(active);
                }
                setLoading(false);
            });
        } catch (error) {
            console.error('Failed to fetch conversations', error);
            setLoading(false);
        }
    };

    const fetchMessages = (convId) => {
        const q = query(collection(db, "messages"), where("conversation_id", "==", convId), orderBy("created_at", "asc"));
        onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    is_mine: data.sender_id === (user.uid || user.id),
                    created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : new Date().toISOString()
                };
            });
            setMessages(msgs);
        });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || !activeConversation) return;

        setSending(true);
        try {
            await apiSendMessage(activeConversation.id, newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
        setSending(false);
    };

    const formatTime = (dateInput) => {
        if (!dateInput) return '';
        const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading && !conversationId) {
        return (
            <div style={{ paddingTop: '120px', textAlign: 'center', background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <RefreshCw size={40} style={{ color: 'var(--primary)' }} />
                </motion.div>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Establishing Secure Uplink...</p>
            </div>
        );
    }

    return (
        <div style={{ 
            height: '100vh', 
            paddingTop: 'var(--header-height)', 
            background: 'radial-gradient(circle at 100% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 0% 100%, var(--accent-glow) 0%, transparent 40%)',
            display: 'flex',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background Accents */}
            <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '300px', height: '300px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.08, zIndex: 0 }} />

            <div className="container" style={{ flex: 1, display: 'flex', gap: '2rem', padding: '2rem', height: 'calc(100vh - var(--header-height))', position: 'relative', zIndex: 1, maxWidth: '1500px' }}>
                
                {/* Sidebar: Clinical Bridge Navigator */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ 
                        width: '400px', display: 'flex', flexDirection: 'column', 
                        padding: '0', background: 'rgba(255,255,255,0.7)', 
                        backdropFilter: 'blur(30px)', border: '1px solid var(--border-subtle)',
                        borderRadius: '32px', overflow: 'hidden'
                    }}
                >
                    <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'white' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.5px', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
                            Clinical <span style={{ color: 'var(--primary)' }}>Bridge</span>
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', background: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                            <Shield size={16} style={{ color: 'var(--success)' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Encrypted Telemetry Active</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="custom-scrollbar">
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--text-soft)' }}>
                                <RefreshCw className="animate-spin" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-soft)' }}>
                                <MessageCircle size={48} style={{ marginBottom: '1.5rem', opacity: 0.3, margin: '0 auto' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Active Channels</h3>
                                <p style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>Synchronize with a medical specialist to begin clinical observation.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <motion.div
                                    key={conv.id}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setActiveConversation(conv);
                                        navigate(`/chat/${conv.id}`);
                                    }}
                                    style={{
                                        padding: '1.25rem', borderRadius: '24px', cursor: 'pointer',
                                        background: conversationId === conv.id ? 'var(--primary)' : 'white',
                                        border: '1px solid var(--border-subtle)',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: conversationId === conv.id ? '0 10px 30px -5px var(--primary-glow)' : 'none',
                                        display: 'flex', gap: '1rem', alignItems: 'center'
                                    }}
                                >
                                    <div style={{ 
                                        width: '56px', height: '56px', borderRadius: '18px', 
                                        background: conversationId === conv.id ? 'rgba(255,255,255,0.2)' : 'var(--primary-plus)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: conversationId === conv.id ? 'white' : 'var(--primary)',
                                        fontSize: '1.25rem', fontWeight: 900, flexShrink: 0
                                    }}>
                                        {(user?.role === 'doctor' ? conv.patient_name : conv.doctor_name)?.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <h4 style={{ 
                                                margin: 0, fontWeight: 800, color: conversationId === conv.id ? 'white' : 'var(--text-main)', 
                                                fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                                            }}>
                                                {user?.role === 'doctor' ? conv.patient_name : `Dr. ${conv.doctor_name}`}
                                            </h4>
                                            {conv.last_message_at && (
                                                <span style={{ fontSize: '0.7rem', color: conversationId === conv.id ? 'rgba(255,255,255,0.7)' : 'var(--text-soft)', fontWeight: 800 }}>
                                                    {formatTime(conv.last_message_at)}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ 
                                            fontSize: '0.85rem', color: conversationId === conv.id ? 'rgba(255,255,255,0.8)' : 'var(--text-soft)',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500
                                        }}>
                                            {conv.last_message || 'Initializing secure link...'}
                                        </div>
                                    </div>
                                    {conv.unread_count > 0 && conversationId !== conv.id && (
                                        <div style={{ minWidth: '20px', height: '20px', borderRadius: '10px', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px var(--primary-glow)' }}>
                                            {conv.unread_count}
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Main Chat Transmission Hub */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card"
                    style={{ 
                        flex: 1, display: 'flex', flexDirection: 'column', padding: 0,
                        background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(30px)',
                        border: '1px solid var(--border-subtle)', borderRadius: '40px', overflow: 'hidden'
                    }}
                >
                    {activeConversation ? (
                        <>
                            {/* Header: High-Fidelity Practitioner Info */}
                            <div style={{ padding: '1.5rem 2.5rem', background: 'white', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ 
                                        width: '60px', height: '60px', borderRadius: '20px', 
                                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                        fontSize: '1.5rem', fontWeight: 900, boxShadow: '0 12px 24px -8px var(--primary-glow)'
                                    }}>
                                        {(user?.role === 'doctor' ? activeConversation.patient_name : activeConversation.doctor_name)?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                            {user?.role === 'doctor' ? activeConversation.patient_name : `Dr. ${activeConversation.doctor_name}`}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                                            Synchronized Live
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {[Phone, Video, MoreVertical].map((Icon, i) => (
                                        <motion.button 
                                            key={i} 
                                            whileHover={{ scale: 1.1, background: 'var(--primary-plus)', color: 'var(--primary)' }} 
                                            style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--bg-color)', color: 'var(--text-soft)', border: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                                        >
                                            <Icon size={22} />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Chronological Transmission Grid */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {messages.map((msg, i) => (
                                        <motion.div 
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            style={{ 
                                                alignSelf: msg.is_mine ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%', display: 'flex', flexDirection: 'column',
                                                alignItems: msg.is_mine ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <div style={{ 
                                                padding: '1.25rem 1.75rem', borderRadius: msg.is_mine ? '28px 28px 4px 28px' : '28px 28px 28px 4px',
                                                background: msg.is_mine ? 'var(--primary)' : 'white',
                                                color: msg.is_mine ? 'white' : 'var(--text-main)',
                                                fontWeight: 500, fontSize: '1.05rem', lineHeight: 1.5,
                                                boxShadow: msg.is_mine ? '0 12px 24px -10px var(--primary-glow)' : '0 10px 25px -10px rgba(0,0,0,0.05)',
                                                border: msg.is_mine ? 'none' : '1px solid var(--border-subtle)',
                                                position: 'relative'
                                            }}>
                                                {msg.text || msg.content}
                                                <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', opacity: 0.8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {msg.is_mine && <CheckCheck size={14} />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Intelligent Input Hub */}
                            <div style={{ padding: '2.5rem', background: 'white', borderTop: '1px solid var(--border-subtle)' }}>
                                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <MessageCircle size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                                        <input
                                            type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Transmit medical observations or queries..."
                                            style={{ 
                                                width: '100%', height: '64px', padding: '0 1.5rem 0 60px', border: '1px solid var(--border-medium)',
                                                borderRadius: '20px', background: 'var(--bg-color)', fontSize: '1rem', fontWeight: 600,
                                                outline: 'none', transition: 'all 0.3s ease', fontFamily: 'Inter, sans-serif'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--primary)';
                                                e.target.style.boxShadow = '0 0 0 4px var(--primary-glow)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--border-medium)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }} 
                                        whileTap={{ scale: 0.95 }}
                                        type="submit" 
                                        disabled={sending || !newMessage.trim()}
                                        style={{ 
                                            width: '64px', height: '64px', borderRadius: '20px', background: sending || !newMessage.trim() ? 'var(--text-soft)' : 'var(--primary)',
                                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                                            boxShadow: sending || !newMessage.trim() ? 'none' : '0 15px 30px -10px var(--primary-glow)', 
                                            cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {sending ? <RefreshCw size={24} className="animate-spin" /> : <Send size={24} />}
                                    </motion.button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-soft)', padding: '4rem', textAlign: 'center' }}>
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                style={{ width: '160px', height: '160px', borderRadius: '50px', background: 'white', border: '1px solid var(--border-subtle)', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '3rem' }}
                            >
                                <Zap size={80} style={{ opacity: 0.8 }} />
                            </motion.div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1.5px' }}>
                                Neural <span className="text-gradient">Bridge</span> Idle
                            </h2>
                            <p style={{ maxWidth: '450px', fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                                Please select a clinical communication node from the directory to initialize end-to-end encrypted telemetry.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ChatPage;
