import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Plus, Check } from 'lucide-react';

const SymptomForm = ({ onAnalyze, isLoading }) => {
    const [symptoms, setSymptoms] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (symptoms.trim()) {
            onAnalyze(symptoms);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2.5rem', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(96, 165, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Activity size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>How are you feeling?</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Describe your symptoms to our Medical AI for a preliminary assessment and specialist recommendation.
            </p>

            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem', color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Common Symptoms</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {commonSymptoms.map(s => {
                        const isSelected = symptoms.includes(s);
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => addSymptom(s)}
                                style={{
                                    padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500,
                                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                    background: isSelected ? 'rgba(96, 165, 250, 0.1)' : '#f8f9fa',
                                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {isSelected ? <Check size={14} /> : <Plus size={14} />} {s}
                            </button>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>Your Symptoms</label>
                    <textarea
                        rows="4"
                        placeholder="e.g., I have a splitting headache and nausea that started yesterday..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        disabled={isLoading}
                        style={{
                            width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)',
                            background: '#f8f9fa', color: 'var(--text-main)', fontSize: '1rem', resize: 'vertical',
                            transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none'
                        }}
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !symptoms.trim()}
                    style={{
                        width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none',
                        borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, cursor: isLoading || !symptoms.trim() ? 'not-allowed' : 'pointer',
                        boxShadow: 'var(--shadow-sm)', opacity: isLoading || !symptoms.trim() ? 0.7 : 1
                    }}
                >
                    {isLoading ? 'Analyzing Symptoms...' : 'Analyze & Find Specialist'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default SymptomForm;
