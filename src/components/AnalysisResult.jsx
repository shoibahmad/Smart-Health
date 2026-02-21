import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Brain, Clock, Activity, Calendar, Award } from 'lucide-react';

const AnalysisResult = ({ result, onProceed }) => {
    if (!result) return null;

    const confidencePercentage = result.confidence ? Math.round(result.confidence * 100) : 85;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ maxWidth: '650px', margin: '2rem auto', padding: '2.5rem', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)' }}>

            {/* Disclaimer */}
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', background: '#fffbeb', borderRadius: '12px', padding: '1rem', border: '1px solid #fde68a', marginBottom: '2rem' }}>
                <ShieldAlert size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, color: '#92400e', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    <strong>Medical Disclaimer:</strong> This is a preliminary assessment performed by Artificial Intelligence. It is intended for informational purposes only and is not a substitute for professional medical diagnosis or treatment.
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.25rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                        Recommended Department
                    </h3>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity style={{ color: 'var(--primary)' }} /> {result.department}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        background: result.triage_priority === 'Critical' ? '#fee2e2' : result.triage_priority === 'High' ? '#ffedd5' : '#dcfce7',
                        color: result.triage_priority === 'Critical' ? 'var(--danger)' : result.triage_priority === 'High' ? '#ea580c' : '#16a34a',
                        padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                        <Award size={16} /> {result.triage_priority} Priority
                    </div>
                </div>
            </div>

            {/* AI Summary and Confidence */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                        <Brain size={18} style={{ color: 'var(--primary)' }} /> AI Assessment Summary
                    </h4>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: confidencePercentage > 80 ? '#10b981' : 'var(--text-muted)' }}>
                        {confidencePercentage}% Match
                    </span>
                </div>
                {/* Confidence Bar */}
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{
                        width: `${confidencePercentage}%`, height: '100%',
                        background: `linear-gradient(90deg, var(--primary) 0%, ${confidencePercentage > 80 ? '#10b981' : '#3b82f6'} 100%)`,
                        transition: 'width 1s ease-in-out'
                    }} />
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', background: '#f8f9fa', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    {result.summary || `Based on the provided symptoms, we strongly recommend a comprehensive evaluation by a specialist in ${result.department}.`}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, background: 'rgba(96, 165, 250, 0.05)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock style={{ color: 'var(--primary)' }} />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Est. Duration</div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{result.estimated_duration_minutes} mins</div>
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onProceed}
                style={{
                    width: '100%', padding: '1.1rem', background: 'var(--text-main)', color: 'white',
                    border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                    boxShadow: 'var(--shadow-md)'
                }}>
                <Calendar size={18} /> View Available Doctors
            </motion.button>
        </motion.div>
    );
};

export default AnalysisResult;
