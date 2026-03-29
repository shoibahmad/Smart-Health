import React, { useState } from 'react';
import SymptomForm from '../components/SymptomForm';
import AnalysisResult from '../components/AnalysisResult';
import BookingFlow from '../components/BookingFlow';
import { analyzeSymptoms } from '../services/api';

const MainApp = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('input'); // input, analysis, booking

    const handleAnalyze = async (symptoms) => {
        setLoading(true);
        try {
            const result = await analyzeSymptoms(symptoms);
            setAnalysis({ ...result, symptoms });
            setStep('analysis');
        } catch (error) {
            console.error("Error analyzing symptoms:", error);
            alert("Failed to analyze symptoms. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '4rem', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ margin: 0 }}>Smart Health Checkup</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>AI-Assisted Diagnostics & Scheduling</p>
            </div>

            {step === 'input' && (
                <SymptomForm onAnalyze={handleAnalyze} isLoading={loading} />
            )}

            {step === 'analysis' && (
                <AnalysisResult
                    result={analysis}
                    onProceed={() => setStep('booking')}
                />
            )}

            {step === 'booking' && analysis && (
                <BookingFlow
                    analysis={analysis}
                />
            )}

            {step !== 'input' && (
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => { setStep('input'); setAnalysis(null); }}
                        style={{ background: 'transparent', color: 'var(--text-muted)', marginTop: '2rem', border: '1px solid var(--glass-border)' }}
                    >
                        Start New Checkup
                    </button>
                </div>
            )}
        </div>
    );
};

export default MainApp;
