import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Plus, Check, AlertCircle, Thermometer, Brain } from 'lucide-react';

const SymptomForm = ({ onAnalyze, isLoading }) => {
    const [symptoms, setSymptoms] = useState('');
    const [severity, setSeverity] = useState(5);
    const [detectedKeywords, setDetectedKeywords] = useState([]);

    const commonSymptoms = [
        "Headache & Nausea", "Fever & Chills", "Chest Pain",
        "Skin Rash", "Toothache", "Blurred Vision",
        "Stomach Ache", "Joint Pain", "Anxiety & Sleep Issues"
    ];

    const addSymptom = (s) => {
        if (!symptoms.includes(s)) {
            setSymptoms(prev => prev ? `${prev}, ${s}` : s);
        }
    };

    const MEDICAL_KEYWORDS = [
        "headache", "nausea", "fever", "chills", "chest", "pain", "rash", "toothache",
        "vision", "stomach", "joint", "anxiety", "sleep", "dizzy", "bleeding", "cough",
        "breath", "swelling", "vomit", "weakness", "numb"
    ];

    // Real-time keyword tagging
    useEffect(() => {
        if (!symptoms) {
            setDetectedKeywords([]);
            return;
        }
        const text = symptoms.toLowerCase();
        const found = MEDICAL_KEYWORDS.filter(kw => text.includes(kw));
        setDetectedKeywords(found);
    }, [symptoms]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (symptoms.trim()) {
            onAnalyze(symptoms, severity);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3.5rem', borderRadius: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-plus)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Activity size={28} />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>Diagnostic Input</h2>
                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '1rem', fontWeight: 500 }}>Step 1: Synchronize your symptoms with the AI engine.</p>
                </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <h4 style={{ margin: '0 0 1.25rem', color: 'var(--text-main)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 900 }}>Clinical Baseline</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {commonSymptoms.map(s => {
                        const isSelected = symptoms.includes(s);
                        return (
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                key={s}
                                type="button"
                                onClick={() => addSymptom(s)}
                                style={{
                                    padding: '0.75rem 1.25rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700,
                                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    background: isSelected ? 'var(--primary-plus)' : 'white',
                                    color: isSelected ? 'var(--primary)' : 'var(--text-soft)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isSelected ? '0 4px 12px var(--primary-glow)' : 'none'
                                }}
                            >
                                {isSelected ? <Check size={16} /> : <Plus size={16} />} {s}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Detailed Symptom Log
                        </label>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>SECURE TRANSMISSION ACTIVE</span>
                    </div>
                    <textarea
                        rows="5"
                        placeholder="Provide a comprehensive description of your medical condition..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        disabled={isLoading}
                        style={{
                            width: '100%', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-subtle)',
                            background: 'white', color: 'var(--text-main)', fontSize: '1.1rem', resize: 'vertical',
                            transition: 'all 0.3s ease', outline: 'none', fontWeight: 500, lineHeight: 1.6,
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)'
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {detectedKeywords.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detected Markers:</span>
                                {detectedKeywords.map(kw => (
                                    <span key={kw} style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 0.85rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 4px 10px var(--primary-glow)' }}>
                                        {kw}
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Thermometer size={20} style={{ color: severity > 7 ? 'var(--danger)' : severity > 4 ? '#f59e0b' : '#10b981' }} />
                            Severity Vector: <span style={{ fontSize: '1.5rem', color: severity > 7 ? 'var(--danger)' : severity > 4 ? '#f59e0b' : '#10b981', fontFamily: 'Outfit, sans-serif' }}>{severity}</span><span style={{ color: 'var(--text-soft)', fontSize: '1rem' }}>/10</span>
                        </label>
                    </div>
                    <input
                        type="range"
                        min="1" max="10"
                        value={severity}
                        onChange={(e) => setSeverity(parseInt(e.target.value))}
                        disabled={isLoading}
                        style={{ width: '100%', cursor: 'pointer', height: '8px', borderRadius: '4px', background: 'var(--border-subtle)', outline: 'none', transition: 'all 0.3s' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <span>Baseline</span>
                        <span>Moderate</span>
                        <span>CRITICAL</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 15px 30px -10px var(--primary-glow)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !symptoms.trim()}
                    style={{
                        width: '100%', padding: '1.25rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: 'white', border: 'none',
                        borderRadius: '18px', fontSize: '1.1rem', fontWeight: 900, cursor: isLoading || !symptoms.trim() ? 'not-allowed' : 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', opacity: isLoading || !symptoms.trim() ? 0.6 : 1,
                        textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
                    }}
                >
                    {isLoading ? (
                        <>
                            <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            Synchronizing AI Nodes...
                        </>
                    ) : (
                        <>
                            <Brain size={20} /> Execute Diagnostic Analysis
                        </>
                    )}
                </motion.button>
            </form>

            <style>{`
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 4px solid var(--primary);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 0 8px var(--primary-plus);
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </motion.div>
    );
};

export default SymptomForm;
