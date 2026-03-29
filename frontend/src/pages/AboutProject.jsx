import React from 'react';
import { motion } from 'framer-motion';
import {
    Layers, Server, Database, Activity, Code, Cpu, Shield,
    ArrowRight, ArrowDown, Users, FileText, Zap, Settings, UserPlus, Mail, Lock
} from 'lucide-react';

const AboutProject = () => {

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

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
            <div style={{ position: 'absolute', top: '20%', left: '-5%', width: '600px', height: '600px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '500px', height: '500px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, zIndex: 0 }} />

            {/* HERO SECTION */}
            <div style={{ padding: '6rem 2rem', textAlign: 'center', marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', 
                        background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', borderRadius: '24px', 
                        border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', marginBottom: '2.5rem' 
                    }}>
                        <Cpu size={24} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '2px', textTransform: 'uppercase' }}>Technical Dossier v4.5</span>
                    </div>
                    <h1 style={{ fontSize: '5rem', margin: '0 0 1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-3px', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                        System <span style={{ color: 'var(--primary)' }}>Integrity</span> & Architecture
                    </h1>
                    <p style={{ fontSize: '1.4rem', color: 'var(--text-soft)', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto', fontWeight: 500 }}>
                        Deep-space analysis of the Smart Health neural core. Exploring decentralized data flows, autonomous diagnostic pipelines, and global medical synchronization nodes.
                    </p>
                </motion.div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>

                {/* 1. TECH STACK */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: '10rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }} />
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Clinical Computing Stack</h2>
                            <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                        {[
                            { icon: Code, color: '#3b82f6', title: 'Interface Protocol', items: ['React 18 & Vite Ecosystem', 'Framer Motion Spatial Engine', 'High-Fidelity SVG Analytics', 'Glassmorphism Design Tokens'] },
                            { icon: Server, color: '#10b981', title: 'Neural Core API', items: ['Async FastAPI Infrastructure', 'Pydantic Schema Enforcement', 'APScheduler Task Management', 'Scikit-Learn Diagnostic Logic'] },
                            { icon: Shield, color: '#f59e0b', title: 'Data Sovereignty', items: ['Firebase Distributed Ledger', 'JWT Identity Management', 'Granular Role-Based Access', 'HIPAA Compliant Encryption'] }
                        ].map((stack, i) => (
                            <motion.div 
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="glass-card" 
                                style={{ padding: '3.5rem 2.5rem', borderRadius: '32px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.7)' }}
                            >
                                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: `${stack.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stack.color, marginBottom: '2rem' }}>
                                    <stack.icon size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 1.5rem', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>{stack.title}</h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {stack.items.map((item, j) => (
                                        <li key={j} style={{ color: 'var(--text-soft)', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: stack.color }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 2. DFD LEVEL 0 */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '10rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' }}>Contextual Data Flow (Level 0)</h2>
                        <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', fontWeight: 600 }}>Highest-level telemetry abstraction for external entities.</p>
                    </div>

                    <div className="glass-card" style={{ padding: '6rem 3rem', borderRadius: '40px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.4)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', width: '100%', position: 'relative', zIndex: 1 }}>

                            <motion.div whileHover={{ scale: 1.05 }} style={{ padding: '2rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '24px', width: '240px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                <Users size={40} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontWeight: 900, fontSize: '1.1rem' }}>PATIENT NODE</h4>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Symptoms • Bookings</div>
                            </motion.div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to right, #3b82f6, var(--primary))' }} />
                                <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to left, #3b82f6, var(--primary))' }} />
                            </div>

                            <motion.div animate={{ boxShadow: ['0 0 20px rgba(96, 165, 250, 0.2)', '0 0 40px rgba(96, 165, 250, 0.5)', '0 0 20px rgba(96, 165, 250, 0.2)'] }} transition={{ repeat: Infinity, duration: 3 }} style={{ padding: '3rem 2.5rem', background: 'var(--primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '32px', width: '320px', textAlign: 'center', color: 'white' }}>
                                <Activity size={56} style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>SMART CORE (0.0)</h3>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.8 }}>Central Intelligence Node</div>
                            </motion.div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to left, #10b981, var(--primary))' }} />
                                <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to right, #10b981, var(--primary))' }} />
                            </div>

                            <motion.div whileHover={{ scale: 1.05 }} style={{ padding: '2rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '24px', width: '240px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                <UserPlus size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontWeight: 900, fontSize: '1.1rem' }}>SPECIALIST NODE</h4>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Protocols • Diagnosis</div>
                            </motion.div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2.5rem', position: 'relative', zIndex: 1 }}>
                            <ArrowDown size={32} color="var(--primary)" style={{ opacity: 0.5 }} />
                            <motion.div whileHover={{ scale: 1.05 }} style={{ padding: '2rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '24px', width: '240px', textAlign: 'center', marginTop: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                <Shield size={40} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontWeight: 900, fontSize: '1.1rem' }}>ADMINISTRATIVE NODE</h4>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Audit • Synchronization</div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* 3. CORE ENGINEERING TEAM */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '10rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' }}>Core Engineering Team</h2>
                        <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', fontWeight: 600 }}>Architects of the Smart Health Neural Core at Integral University.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                        {[
                            {
                                name: 'Mohammad Adnan Khan',
                                role: 'Lead System Architect',
                                institution: 'Integral University',
                                email: 'ak700@gmail.com',
                                vision: 'Specializes in decentralized medical data flows and high-performance API orchestration.'
                            },
                            {
                                name: 'Muzammil Iftikhar',
                                role: 'Senior Intelligence Engineer',
                                institution: 'Integral University',
                                email: 'ak700@gmail.com',
                                vision: 'Focuses on predictive diagnostic modeling and clinical-grade interface protocols.'
                            }
                        ].map((dev, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)' }}
                                className="glass-card" 
                                style={{ padding: '4rem 3rem', borderRadius: '40px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.6)', textAlign: 'center' }}
                            >
                                <div style={{ 
                                    width: '100px', height: '100px', borderRadius: '35px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                    margin: '0 auto 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                    boxShadow: '0 20px 40px -10px var(--primary-glow)', fontSize: '2rem', fontWeight: 900
                                }}>
                                    {dev.name[0]}
                                </div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.5rem', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>{dev.name}</h3>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>{dev.role}</div>
                                <p style={{ color: 'var(--text-soft)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '2.5rem' }}>{dev.vision}</p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                        <Layers size={16} style={{ color: 'var(--primary)' }} /> {dev.institution}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                        <Mail size={16} style={{ color: 'var(--primary)' }} /> {dev.email}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 4. CLINICAL DATA LIFECYCLE */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '10rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' }}>Neural Triage Logic</h2>
                        <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', fontWeight: 600 }}>The algorithmic pipeline from raw symptoms to specialist routing.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { step: '01', title: 'Biometric Input', desc: 'Patients provide natural language symptoms and vitals (BP, Heart Rate, SpO2) via the secure terminal.' },
                            { step: '02', title: 'Tokenization', desc: 'Natural Language Processing (NLP) extracts clinical tokens and maps them to a medical taxonomy.' },
                            { step: '03', title: 'Bayesian Prediction', desc: 'The scikit-learn core calculates probability scores for departmental relevance based on historical pathology.' },
                            { step: '04', title: 'Specialist Sync', desc: 'Automated referral generation and slot-locking within the relevant clinical department node.' }
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{ padding: '2.5rem', borderRadius: '28px', border: '1px solid var(--border-subtle)', background: 'white' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-plus)', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{item.step}</div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-soft)', fontWeight: 600, lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* 5. SECURITY & COMPLIANCE BLUEPRINT */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '10rem' }}>
                    <div style={{ padding: '6rem', background: 'var(--text-main)', borderRadius: '48px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.25rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', marginBottom: '2.5rem' }}>
                                    <Shield size={18} style={{ color: '#10b981' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>Security Protocol Alpha</span>
                                </div>
                                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, margin: '0 0 2rem', fontFamily: 'Outfit, sans-serif', lineHeight: 1.1 }}>Clinical Grade <br /><span style={{ color: 'var(--primary)' }}>Security Lattice</span></h2>
                                <p style={{ fontSize: '1.15rem', opacity: 0.7, lineHeight: 1.8, marginBottom: '3rem', fontWeight: 500 }}>
                                    Smart Health implements a zero-trust architecture. Every clinical transaction is verified through multi-factor cryptographic signatures, ensuring that patient data remains sovereign and immutable.
                                </p>
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {[
                                        'AES-256 Bit End-to-End Encryption',
                                        'Firebase IAM Policy Enforcement',
                                        'HIPAA & GDPR Compliant Data Stores',
                                        'Neural Anonymization for Research'
                                    ].map((sec, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, fontSize: '1rem' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                                            </div>
                                            {sec}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
                                    <pre style={{ margin: 0, fontSize: '0.85rem', color: '#60a5fa', fontFamily: 'monospace', lineHeight: 1.6 }}>
                                        {`{
  "node_id": "IU-LKO-CORE-001",
  "encryption": "AES_256_GCM",
  "audit_log": "ENABLED",
  "sovereignty": 1,
  "neural_mask": true,
  "firewall": "ACTIVE",
  "last_sync": "${new Date().toISOString()}"
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 6. FUTURE ROADMAP */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' }}>Project Evolution</h2>
                        <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', fontWeight: 600 }}>The next phase of medical intelligence synchronization.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Telemedicine Bridge', date: 'Q3 2026', desc: 'WebRTC-powered secure video consultations directly within the neural terminal.' },
                            { title: 'Wearable Sync', desc: 'Real-time vital streaming from IoT medical devices via local Bluetooth mesh.' },
                            { title: 'Global Pharmacy', desc: 'Decentralized prescription fulfillment network with blockchain verification.' },
                            { title: 'Research Vault', desc: 'Anonymized dataset sharing for global medical research and pandemic modeling.' }
                        ].map((milestone, i) => (
                            <div key={i} style={{ padding: '2.5rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '32px', position: 'relative' }}>
                                {milestone.date && <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.4rem 0.8rem', background: 'var(--primary-plus)', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)' }}>{milestone.date}</div>}
                                <Zap size={24} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>{milestone.title}</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-soft)', fontWeight: 600, lineHeight: 1.6 }}>{milestone.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>


            </div>
        </div>
    );
};

export default AboutProject;
