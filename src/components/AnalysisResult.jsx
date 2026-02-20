import React from 'react';

const AnalysisResult = ({ result, onProceed }) => {
    if (!result) return null;

    return (
        <div className="glass-card fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h3 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                AI Recommendation
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.department}</div>
                    <div style={{ color: 'var(--primary)' }}>Specialist: {result.recommended_doctor}</div>
                </div>
                <div style={{
                    background: result.triage_priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: result.triage_priority === 'Critical' ? '#ef4444' : '#10b981',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }}>
                    {result.triage_priority} Priority
                </div>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'left',
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
            }}>
                Estimated Consultation Duration: <strong>{result.estimated_duration_minutes} mins</strong>
            </div>

            <button onClick={onProceed} style={{ width: '100%' }}>
                View Available Slots
            </button>
        </div>
    );
};

export default AnalysisResult;
