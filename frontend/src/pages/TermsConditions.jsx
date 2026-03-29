import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileSignature, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div style={{ 
            paddingTop: '120px', 
            paddingBottom: '8rem', 
            background: 'radial-gradient(circle at 0% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent-glow) 0%, transparent 40%)',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Background Accents */}
            <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '400px', height: '400px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />

            <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="glass-card"
                    style={{ 
                        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(30px)', 
                        border: '1px solid var(--border-subtle)', borderRadius: '48px', 
                        padding: '5rem 4rem', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.05)' 
                    }}
                >

                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-plus)', color: 'var(--primary)', marginBottom: '2rem' }}
                        >
                            <Scale size={40} />
                        </motion.div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-2px', fontFamily: 'Outfit, sans-serif' }}>Terms & <span style={{ color: 'var(--primary)' }}>Conditions</span></h1>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-soft)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            <span style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }} />
                            Legal Governance Framework • {new Date().getFullYear()}
                            <span style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }} />
                        </div>
                    </div>

                    <div style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--text-soft)', fontWeight: 500, borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem' }}>
                            These stipulations govern the operational usage of the Smart Health Neural platform. By initializing a session or account, you concede to the following clinical and legal protocols.
                        </p>

                        <div style={{ display: 'grid', gap: '4rem' }}>
                            <section>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><FileSignature size={18} /></div>
                                    1. Clinical Service Architecture
                                </h2>
                                <p style={{ color: 'var(--text-soft)', fontWeight: 500, marginBottom: '1.5rem' }}>The Smart Health Neural platform facilitates advanced digital clinical synchronization, governed by the following operational parameters:</p>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
                                    {[
                                        { label: 'Neural Triage Protocols', desc: 'AI-assisted symptom analysis designed for departmental prioritization and preliminary diagnostic mapping.' },
                                        { label: 'Cloud-Synced Authorizations', desc: 'Digital pharmaceutical prescriptions issued by verified medical practitioners via secure clinical nodes.' },
                                        { label: 'Specialist Logic', desc: 'Automated referral logistics and real-time scheduling bridges between patients and multi-disciplinary clinics.' }
                                    ].map((item, i) => (
                                        <li key={i} style={{ padding: '1.5rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '20px', display: 'flex', gap: '1.25rem' }}>
                                            <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.9rem', width: '24px' }}>0{i+1}</div>
                                            <div>
                                                <strong style={{ display: 'block', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.4rem', fontSize: '1rem' }}>{item.label}</strong>
                                                <span style={{ fontSize: '0.95rem', color: 'var(--text-soft)', fontWeight: 500, lineHeight: 1.5 }}>{item.desc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><AlertTriangle size={18} /></div>
                                    2. Algorithmic Liability & Limits
                                </h2>
                                <div style={{ padding: '2.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '32px', color: '#b45309' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <AlertTriangle size={24} />
                                        <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal Disclaimer</span>
                                    </div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.7 }}>
                                        The AI-driven insights provided by this platform are categorized as "Clinical Informative Support" (CIS). They are intended to augment, not replace, the professional judgment of a licensed healthcare provider. Smart Health Systems Inc. disclaims all liability for diagnostic decisions made solely based on neural telemetry without physician verification.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><CheckCircle size={18} /></div>
                                    3. Clinical User Accountability
                                </h2>
                                <p style={{ color: 'var(--text-soft)', fontWeight: 500, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    Users are strictly accountable for the veracity of biometric inputs provided to the system. The following actions constitute a breach of protocol and may lead to immediate suspension of clinical node access:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                                    {['Falsification of Pathology', 'Neural Telemetry Spoofing', 'Unauthorized API Hooking', 'Clinical Harassment'].map((rule, i) => (
                                        <div key={i} style={{ padding: '1rem 1.5rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} /> {rule}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div style={{ marginTop: '5rem', padding: '3rem', background: 'var(--bg-color)', borderRadius: '32px', border: '2px dashed var(--border-subtle)', textAlign: 'center' }}>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>Legal Acknowledgement</h3>
                            <p style={{ margin: 0, color: 'var(--text-soft)', fontWeight: 500 }}>By maintaining an active session, you concede to these protocols. For arbitration or regulatory inquiries, contact <strong style={{ color: 'var(--primary)' }}>legal.ops@smarthealth.ai</strong>.</p>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default TermsConditions;
