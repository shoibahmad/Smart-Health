import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, ArrowLeft, User, Shield, Clock,
    Phone, Video, MoreVertical, Check, CheckCheck
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
        const userId = user.uid || user.id;

        try {
            await apiSendMessage(activeConversation.id, newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
        setSending(false);
    };

    const selectConversation = (conv) => {
        setActiveConversation(conv);
        navigate(`/chat/${conv.id}`);
        fetchMessages(conv.id);
    };

    const formatTime = (dateInput) => {
        if (!dateInput) return '';
        const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '120px', textAlign: 'center', background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <MessageCircle size={40} style={{ color: 'var(--primary)' }} />
                </motion.div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading chats...</p>
            </div>
        );
    }

    return (
        <div style={{
            paddingTop: '80px',
            height: '100vh',
            display: 'flex',
            maxWidth: '1400px',
            margin: '0 auto',
            background: 'var(--bg-color)'
        }}>
            {/* Sidebar - Conversations List */}
            <div style={{
                width: '350px',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)',
                zIndex: 10
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', color: 'var(--text-main)' }}>
                        <MessageCircle size={24} style={{ color: 'var(--primary)' }} />
                        Messages
                    </h2>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Shield size={14} style={{ color: '#10b981' }} /> End-to-end encrypted
                    </p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <MessageCircle size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>No conversations yet</p>
                            <p style={{ fontSize: '0.85rem' }}>Start a chat from a doctor's profile</p>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <motion.div
                                key={conv.id}
                                whileHover={{ background: '#f8f9fa' }}
                                onClick={() => selectConversation(conv)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid var(--glass-border)',
                                    background: activeConversation?.id === conv.id ? '#f1f5f9' : '#ffffff',
                                    display: 'flex',
                                    gap: '0.75rem'
                                }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    background: user?.role === 'doctor'
                                        ? 'var(--primary)'
                                        : '#10b981',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.1rem', fontWeight: 700, color: 'white', flexShrink: 0,
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    {(user?.role === 'doctor' ? conv.patient_name : conv.doctor_name)?.charAt(0)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                            {user?.role === 'doctor' ? conv.patient_name : `Dr. ${conv.doctor_name}`}
                                        </h4>
                                        {conv.last_message_at && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {formatTime(conv.last_message_at)}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{
                                        margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>
                                        {conv.last_message || 'No messages yet'}
                                    </p>
                                </div>
                                {conv.unread_count > 0 && (
                                    <span style={{
                                        width: '22px', height: '22px', borderRadius: '50%',
                                        background: 'var(--danger)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 600, color: 'white', alignSelf: 'center',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        {conv.unread_count}
                                    </span>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#ffffff',
                            boxShadow: 'var(--shadow-sm)',
                            zIndex: 5
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    background: user?.role === 'doctor'
                                        ? 'var(--primary)'
                                        : '#10b981',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1rem', fontWeight: 700, color: 'white',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    {(user?.role === 'doctor' ? activeConversation.patient_name : activeConversation.doctor_name)?.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>
                                        {user?.role === 'doctor'
                                            ? activeConversation.patient_name
                                            : `Dr. ${activeConversation.doctor_name}`}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981' }}>Online</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button style={{ background: '#f8f9fa', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.6rem', color: 'var(--primary)', cursor: 'pointer' }}>
                                    <Phone size={18} />
                                </button>
                                <button style={{ background: '#f8f9fa', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.6rem', color: 'var(--primary)', cursor: 'pointer' }}>
                                    <Video size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1, overflowY: 'auto', padding: '1.5rem',
                            display: 'flex', flexDirection: 'column', gap: '1rem'
                        }}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: msg.is_mine ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '70%',
                                        padding: '0.85rem 1.1rem',
                                        borderRadius: msg.is_mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        background: msg.is_mine
                                            ? 'var(--primary)'
                                            : '#ffffff',
                                        color: msg.is_mine ? 'white' : 'var(--text-main)',
                                        border: msg.is_mine ? 'none' : '1px solid var(--glass-border)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: msg.is_mine ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                                                {formatTime(msg.created_at)}
                                            </span>
                                            {msg.is_mine && <CheckCheck size={14} style={{ color: '#10b981' }} />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} style={{
                            padding: '1.25rem 1.5rem',
                            borderTop: '1px solid var(--glass-border)',
                            display: 'flex',
                            gap: '0.75rem',
                            background: '#ffffff',
                            boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.02)',
                            zIndex: 5
                        }}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.9rem 1.25rem',
                                    borderRadius: '25px',
                                    marginBottom: 0,
                                    background: '#f8f9fa',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: sending || !newMessage.trim() ? '#e2e8f0' : 'var(--primary)',
                                    border: 'none', cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
                                    boxShadow: sending || !newMessage.trim() ? 'none' : 'var(--shadow-sm)'
                                }}
                            >
                                <Send size={20} style={{ color: sending || !newMessage.trim() ? '#94a3b8' : 'white', marginLeft: '2px' }} />
                            </motion.button>
                        </form>
                    </>
                ) : (
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                    }}>
                        <MessageCircle size={64} style={{ opacity: 0.3, marginBottom: '1.5rem', color: 'var(--primary)' }} />
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Select a conversation</h3>
                        <p>Choose a chat from the sidebar to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
