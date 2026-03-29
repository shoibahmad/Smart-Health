import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Activity } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div style={{ 
            paddingTop: '120px', 
            paddingBottom: '8rem', 
            background: 'radial-gradient(circle at 100% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 0% 100%, var(--accent-glow) 0%, transparent 40%)',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Background Accents */}
            <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />

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
                            <Shield size={40} />
                        </motion.div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-2px', fontFamily: 'Outfit, sans-serif' }}>Privacy <span style={{ color: 'var(--primary)' }}>Policy</span></h1>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-soft)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            <span style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }} />
                            Version 4.0.2 • Effective {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            <span style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }} />
                        </div>
                    </div>

                    <div style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--text-soft)', fontWeight: 500, borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem' }}>
                            Welcome to the Smart Health Neural Infrastructure. We hold your clinical and biometric data with the highest degree of cryptographic integrity. This dossier outlines our data governance protocols and your statutory rights under international health data regulations.
                        </p>

                        <div style={{ display: 'grid', gap: '4rem' }}>
                            <section>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Lock size={18} /></div>
                                    1. Clinical Data Acquisition Protocols
                                </h2>
                                <p style={{ color: 'var(--text-soft)', fontWeight: 500, marginBottom: '1.5rem' }}>The Smart Health ecosystem implements multi-layered telemetry to capture and calibrate the following data clusters under strict HIPAA and GDPR-informed frameworks:</p>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
                                    {[
                                        { label: 'Neural Identity Markers', desc: 'Secure biometric hashes, clinical identifiers, and cryptographic authentication tokens required for session integrity.' },
                                        { label: 'Diagnostic Telemetry', desc: 'Symptom trajectory maps, historical pathology records, and AI-predicted risk scores synthesized from clinical encounters.' },
                                        { label: 'Infrastructure Metadata', desc: 'Encrypted IP logs, device heartbeat signatures, and regional latency nodes for secure global synchronization.' }
                                    ].map((item, i) => (
                                        <li key={i} style={{ padding: '1.5rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '20px', display: 'flex', gap: '1.25rem', transition: 'transform 0.3s ease' }}>
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
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Eye size={18} /></div>
                                    2. Neural Processing & AI Logic
                                </h2>
                                <p style={{ color: 'var(--text-soft)', fontWeight: 500, marginBottom: '2rem' }}>All clinical data is synthesized through our proprietary Machine Learning refinery. This processing is non-substitutive for medical advice and facilitates:</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    {[
                                        { title: 'Bayesian Triage', desc: 'Prioritizing urgent symptom clusters for rapid clinical review.' },
                                        { title: 'Predictive Modeling', desc: 'Analyzing long-term health trends to forecast preventative interventions.' },
                                        { title: 'Clinical Summary', desc: 'Automated extraction of key medical findings for physician dashboards.' },
                                        { title: 'Routing Logic', desc: 'Identifying the optimal specialist based on diagnostic complexity.' }
                                    ].map((feature, i) => (
                                        <div key={i} style={{ padding: '2rem', background: 'var(--primary-plus)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.9rem' }}>
                                                <Activity size={18} /> {feature.title}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.6 }}>{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Lock size={18} /></div>
                                    3. Data Retention & Neural Erasure
                                </h2>
                                <p style={{ color: 'var(--text-soft)', fontWeight: 500, lineHeight: 1.8 }}>
                                    We maintain clinical records for a period of seven (7) years post-session termination, as mandated by international medical record protocols. Users reserve the "Right to Neural Erasure," allowing for the de-identification of all non-statutory data clusters within 30 days of a formalized request to our Data Protection Office.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><FileText size={18} /></div>
                                    4. Data Subject Rights & Sovereignty
                                </h2>
                                <p style={{ color: 'var(--text-soft)', fontWeight: 500, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    Under the Smart Health Neural Charter, users retain absolute sovereignty over their clinical telemetry. You may exercise the following rights via our secure portal:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {['Right to Rectification', 'Right to Portability', 'Right to Restriction', 'Right to Objection'].map((right, i) => (
                                        <div key={i} style={{ padding: '1rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center' }}>
                                            {right}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Shield size={18} /></div>
                                    5. Third-Party Neural Bridging
                                </h2>
                                <p style={{ color: 'var(--text-soft)', fontWeight: 500, lineHeight: 1.8 }}>
                                    We do not monetize patient telemetry. Data is only bridged to third-party clinical nodes (e.g., specialized laboratories, pharmaceutical registries) upon explicit, session-based user authorization. All bridges are audited via mutual TLS (mTLS) and cryptographic handshakes.
                                </p>
                            </section>
                        </div>

                        <motion.div 
                            whileHover={{ y: -5 }}
                            style={{ 
                                marginTop: '5rem', padding: '3rem', background: 'var(--primary)', 
                                color: 'white', borderRadius: '32px', boxShadow: '0 20px 40px -10px var(--primary-glow)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>Governance Inquiries</h3>
                            <p style={{ margin: '0 0 2rem', fontSize: '1.1rem', opacity: 0.9, fontWeight: 500 }}>For data erasure requests or technical compliance audits, contact our Data Protection Office.</p>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <button style={{ padding: '1rem 2.5rem', background: 'white', color: 'var(--primary)', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    privacy.ops@smarthealth.ai
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>
                                    <Lock size={16} /> IU-LKO SECURE NODE
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
