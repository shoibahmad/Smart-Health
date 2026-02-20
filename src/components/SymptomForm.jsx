import React, { useState } from 'react';

const SymptomForm = ({ onAnalyze, isLoading }) => {
    const [symptoms, setSymptoms] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (symptoms.trim()) {
            onAnalyze(symptoms);
        }
    };

    return (
        <div className="glass-card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>How are you feeling?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Describe your symptoms to our AI-powered assistant for a smart specialist recommendation.
            </p>

            <form onSubmit={handleSubmit}>
                <textarea
                    rows="4"
                    placeholder="e.g., I have a splitting headache and nausea..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !symptoms.trim()} style={{ width: '100%' }}>
                    {isLoading ? 'Analyzing...' : 'Find Specialist'}
                </button>
            </form>
        </div>
    );
};

export default SymptomForm;
