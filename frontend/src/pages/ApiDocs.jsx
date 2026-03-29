import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code, Globe, Shield, Activity, Calendar, Pill, 
    Terminal, ChevronRight, Copy, Check, Search, FileText, Zap
} from 'lucide-react';

const ApiDocs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const categories = [
        {
            title: "Authentication",
            description: "Secure access using Firebase ID Tokens in the Authorization header.",
            endpoints: [
                {
                    id: "auth-header",
                    method: "HEADER",
                    path: "Authorization: Bearer <ID_TOKEN>",
                    description: "Almost all API requests require a valid Firebase ID token.",
                    parameters: [
                        { name: "ID_TOKEN", type: "string", description: "Firebase JWT from user login" }
                    ]
                }
            ]
        },
        {
            title: "User Management",
            description: "Operations for managing user profiles, roles, and schedules.",
            endpoints: [
                {
                    id: "get-users",
                    method: "GET",
                    path: "/api/users",
                    description: "Fetch all users (Requires Admin/Superuser role).",
                    response: "[ { \"id\": \"uid\", \"full_name\": \"...\", \"role\": \"patient\" }, ... ]"
                },
                {
                    id: "get-doctors",
                    method: "GET",
                    path: "/api/doctors",
                    description: "Fetch all registered doctors. Public endpoint.",
                    response: "[ { \"id\": \"uid\", \"full_name\": \"...\", \"profile\": { ... } }, ... ]"
                },
                {
                    id: "update-role",
                    method: "PATCH",
                    path: "/api/users/{user_id}/role",
                    description: "Update a user's role (Admin only).",
                    requestBody: "{ \"role\": \"doctor\" | \"admin\" | \"patient\" }",
                    response: "{ \"status\": \"success\", \"message\": \"...\" }"
                }
            ]
        },
        {
            title: "Appointments & Bookings",
            description: "The core engine for scheduling healthcare consultations.",
            endpoints: [
                {
                    id: "get-appointments",
                    method: "GET",
                    path: "/api/appointments",
                    description: "Lists appointments relevant to the current user's role.",
                    response: "[ { \"doctor_name\": \"...\", \"date\": \"2024-03-30\", \"status\": \"scheduled\" }, ... ]"
                },
                {
                    id: "update-status",
                    method: "PATCH",
                    path: "/api/appointments/{id}/status",
                    description: "Update appointment status (e.g., 'completed', 'cancelled').",
                    requestBody: "{ \"status\": \"completed\" }",
                },
                {
                    id: "reschedule",
                    method: "POST",
                    path: "/api/appointments/{id}/reschedule",
                    description: "Request a new date/time for an existing appointment.",
                    requestBody: "{ \"new_date\": \"...\", \"new_time\": \"...\", \"reason\": \"...\" }",
                }
            ]
        },
        {
            title: "AI Diagnostics & ML",
            description: "AI-powered services for medical analysis and prediction.",
            endpoints: [
                {
                    id: "analyze-symptoms",
                    method: "POST",
                    path: "/api/analyze-symptoms",
                    description: "AI predicts the medical department based on raw symptoms text.",
                    requestBody: "{ \"symptoms\": \"Persistent headache and blurred vision\" }",
                    response: "{ \"department\": \"Neurology\", \"confidence\": 0.92, \"recommended_doctor\": \"Dr. Strange\" }"
                },
                {
                    id: "noshow-risk",
                    method: "GET",
                    path: "/api/ml/noshow-risk/{appointment_id}",
                    description: "Predict the probability of a patient missing their appointment.",
                    response: "{ \"risk_percentage\": 15, \"status\": \"low_risk\" }"
                },
                {
                    id: "summarize-report",
                    method: "POST",
                    path: "/api/summarize-report-pdf",
                    description: "Uses Gemini to extract and summarize key clinical data from a PDF upload.",
                    requestBody: "FormData: { \"file\": Binary PDF }",
                    response: "{ \"summary\": \"Patient shows normal glucose levels...\" }"
                }
            ]
        },
        {
            title: "Digital Health Records",
            description: "Manage Vitals, Prescriptions, and Consultation Notes.",
            endpoints: [
                {
                    id: "get-vitals",
                    method: "GET",
                    path: "/api/vitals",
                    description: "Fetch historic vitals logs for trends.",
                    response: "[ { \"weight\": 72, \"bp_systolic\": 120, \"timestamp\": \"...\" }, ... ]"
                },
                {
                    id: "create-prescription",
                    method: "POST",
                    path: "/api/prescriptions",
                    description: "Allows doctors to issue digital prescriptions.",
                    requestBody: "{ \"patient_id\": \"...\", \"medications\": [ { \"name\": \"...\", ... } ], ... }",
                    response: "{ \"status\": \"success\", \"prescription_id\": \"...\" }"
                }
            ]
        },
        {
            title: "Meet the Architects",
            description: "The core engineering team behind the Smart Health Neural Infrastructure.",
            isArchitects: true,
            architects: [
                {
                    name: "Mohammad Adnan Khan",
                    role: "Lead System Architect",
                    vision: "Specializing in decentralized clinical data flows and high-fidelity diagnostic orchestration.",
                    email: "ak700@gmail.com"
                },
                {
                    name: "Muzammil Iftikhar",
                    role: "Senior Intelligence Engineer",
                    vision: "Focused on neural network optimization and clinical-grade interface protocols.",
                    email: "ak700@gmail.com"
                }
            ]
        }
    ];

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredCategories = categories.map(cat => {
        if (!cat.endpoints) return cat;
        return {
            ...cat,
            endpoints: cat.endpoints.filter(ep => 
                ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        };
    }).filter(cat => cat.isArchitects || (cat.endpoints && cat.endpoints.length > 0));

    return (
        <div style={{ 
            paddingTop: '120px', 
            paddingBottom: '8rem', 
            background: 'radial-gradient(circle at 0% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent-glow) 0%, transparent 40%)',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Accents */}
            <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '500px', height: '500px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.12, zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, zIndex: 0 }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                
                {/* Header Section */}
                <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', borderRadius: '50px', marginBottom: '2rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}
                    >
                        <Terminal size={18} /> Integration Protocols v2.1
                    </motion.div>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 1.5rem', letterSpacing: '-3px', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                        Developer <span style={{ color: 'var(--primary)' }}>Hub</span>
                    </h1>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', fontWeight: 500, lineHeight: 1.6 }}>
                        Leverage the Smart Health neural infrastructure via our clinical-grade REST endpoints. Architected for 99.99% reliability and sub-100ms diagnostic latency.
                    </p>

                    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', zIndex: 2 }}>
                            <Search size={22} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Filter by endpoint, method, or clinical module..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '1.5rem 1.5rem 1.5rem 60px', borderRadius: '24px', 
                                background: 'white', border: '1px solid var(--border-subtle)',
                                color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600,
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', outline: 'none'
                            }}
                        />
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '0.5rem 1rem', background: 'var(--bg-color)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', border: '1px solid var(--border-subtle)' }}>
                            CTRL + K
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '6rem' }}>
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((cat, idx) => (
                            <motion.div 
                                layout
                                key={cat.title} 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        {cat.isArchitects ? <Globe size={28} /> : (cat.endpoints?.[0]?.method === 'HEADER' ? <Shield size={28} /> : <Code size={28} />)}
                                    </div>
                                    <div>
                                        <h2 style={{ color: 'var(--text-main)', margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}>{cat.title}</h2>
                                        <p style={{ color: 'var(--text-soft)', margin: '0.25rem 0 0', fontSize: '1.05rem', fontWeight: 500 }}>{cat.description}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {cat.isArchitects ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                                            {cat.architects.map((dev, i) => (
                                                <div key={i} className="glass-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-plus)', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 900 }}>{dev.name[0]}</div>
                                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem', fontFamily: 'Outfit, sans-serif' }}>{dev.name}</h3>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>{dev.role}</div>
                                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-soft)', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>{dev.vision}</p>
                                                    <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                                                        {dev.email}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        cat.endpoints.map((ep) => (
                                            <motion.div 
                                                whileHover={{ y: -5 }}
                                                key={ep.id} 
                                                className="glass-card"
                                                style={{ 
                                                    background: 'rgba(255,255,255,0.7)', borderRadius: '32px', border: '1px solid var(--border-subtle)', padding: '3rem',
                                                    boxShadow: '0 30px 60px -20px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                        <span style={{ 
                                                            padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 900,
                                                            background: ep.method === 'GET' ? '#dcfce7' : ep.method === 'POST' ? '#e0e7ff' : ep.method === 'PATCH' ? '#fef3c7' : '#f1f5f9',
                                                            color: ep.method === 'GET' ? '#166534' : ep.method === 'POST' ? '#3730a3' : ep.method === 'PATCH' ? '#92400e' : '#475569',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            {ep.method}
                                                        </span>
                                                        <code style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, fontFamily: 'monospace', background: 'var(--primary-plus)', padding: '0.4rem 0.8rem', borderRadius: '10px' }}>{ep.path}</code>
                                                    </div>
                                                    <motion.button 
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => copyToClipboard(`https://api.smarthealth.ai${ep.path}`, ep.id)}
                                                        style={{ padding: '0.75rem 1.25rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '14px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                                                    >
                                                        {copiedId === ep.id ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
                                                        {copiedId === ep.id ? 'Copied' : 'Copy Endpoint'}
                                                    </motion.button>
                                                </div>

                                                <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
                                                    {ep.description}
                                                </p>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                                    {ep.requestBody && (
                                                        <div style={{ background: '#0f172a', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <Terminal size={14} /> JSON Request Payload
                                                            </div>
                                                            <pre style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.6 }}>{ep.requestBody}</pre>
                                                        </div>
                                                    )}
                                                    {ep.response && (
                                                        <div style={{ background: '#0f172a', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <FileText size={14} /> Clinical Response Object
                                                            </div>
                                                            <pre style={{ margin: 0, color: '#34d399', fontSize: '0.9rem', overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.6 }}>{ep.response}</pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer Note */}
                <motion.div 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    style={{ marginTop: '8rem', padding: '5rem 3rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px dashed var(--border-subtle)', borderRadius: '40px', textAlign: 'center' }}
                >
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 2rem' }}>
                        <Globe size={40} />
                    </div>
                    <h3 style={{ color: 'var(--text-main)', fontSize: '2rem', fontWeight: 900, margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' }}>Seamless Protocol Integration</h3>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem', fontWeight: 500 }}>Our specialist synchronization bridge is monitored 24/7. Need a custom clinical webhook? Our engineering team is standing by.</p>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '1.25rem 3rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 20px 40px -10px var(--primary-glow)' }}>
                        Request Access Tokens
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default ApiDocs;
