import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BrainCircuit, CalendarCheck, RefreshCw, ChevronRight } from 'lucide-react';
import SymptomForm from '../components/SymptomForm';
import AnalysisResult from '../components/AnalysisResult';
import BookingFlow from '../components/BookingFlow';
import AlertModal from '../components/AlertModal';
import { analyzeSymptoms } from '../services/api';

const steps = [
    { id: 'input', label: 'Symptoms', icon: Activity },
    { id: 'analysis', label: 'AI Analysis', icon: BrainCircuit },
    { id: 'booking', label: 'Booking', icon: CalendarCheck }
];

const MainApp = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('input');
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const handleAnalyze = async (symptoms, patientSeverityScore) => {
        setLoading(true);
        try {
            // Updated API call to pass severity
            const result = await analyzeSymptoms({ symptoms, patient_severity_score: patientSeverityScore });
            setAnalysis({ ...result, symptoms });
            setStep('analysis');
        } catch (error) {
            console.error("Error analyzing symptoms:", error);
            setAlertConfig({
                isOpen: true,
                title: "Analysis Failed",
                message: "We couldn't analyze your symptoms. Please check your internet connection and try again.",
                type: "danger"
            });
        }
        setLoading(false);
    };

    const currentStepIndex = steps.findIndex(s => s.id === step);

    return (
        <div style={{ 
            paddingTop: '120px', 
            paddingBottom: '6rem', 
            minHeight: '100vh', 
            background: 'radial-gradient(circle at 0% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent-glow) 0%, transparent 40%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Accents */}
            <div style={{ position: 'absolute', top: '15%', left: '5%', width: '600px', height: '600px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '60%', right: '5%', width: '400px', height: '400px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.05, zIndex: 0 }} />

            {/* Immersive Hero Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.6)', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                        <Activity size={24} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Clinical AI Protocol</span>
                    </div>
                    <h1 style={{ margin: 0, fontSize: '4.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-3px', fontFamily: 'Outfit, sans-serif', lineHeight: 0.9 }}>
                        Precision <span style={{ color: 'var(--primary)' }}>Diagnostics</span>
                    </h1>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1.25rem', marginTop: '1.5rem', maxWidth: '700px', margin: '1.5rem auto 0', lineHeight: 1.6, fontWeight: 500 }}>
                        Execute a high-fidelity clinical synthesis of your symptoms. Our decentralized AI engine will triage and synchronize with world-class medical nodes.
                    </p>
                </motion.div>
            </div>

            {/* Progress Stepper */}
            <div style={{ maxWidth: '900px', margin: '0 auto 5rem', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

                    {/* Background Progress Line */}
                    <div style={{ position: 'absolute', top: '28px', left: '10%', right: '10%', height: '2px', background: 'var(--border-subtle)', zIndex: 0 }} />
                    <div style={{ position: 'absolute', top: '28px', left: '10%', height: '2px', background: 'var(--primary)', zIndex: 1, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', width: `${(currentStepIndex / (steps.length - 1)) * 80}%` }} />

                    {steps.map((s, idx) => {
                        const isActive = idx === currentStepIndex;
                        const isPast = idx < currentStepIndex;
                        return (
                            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', zIndex: 2, width: '120px' }}>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: isActive ? 'var(--primary)' : isPast ? '#10b981' : 'white',
                                        borderColor: isActive || isPast ? 'transparent' : 'var(--border-subtle)',
                                        color: isActive || isPast ? 'white' : 'var(--text-soft)',
                                        scale: isActive ? 1.2 : 1,
                                        boxShadow: isActive ? '0 15px 30px -8px var(--primary-glow)' : '0 4px 12px rgba(0,0,0,0.03)'
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    style={{ width: '56px', height: '56px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', transition: 'all 0.3s' }}
                                >
                                    <s.icon size={24} />
                                </motion.div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: isActive ? 'var(--text-main)' : 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dynamic Content Views */}
            <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
                <AnimatePresence mode="wait">
                    {step === 'input' && (
                        <motion.div key="input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                            <SymptomForm onAnalyze={handleAnalyze} isLoading={loading} />
                        </motion.div>
                    )}

                    {step === 'analysis' && analysis && (
                        <motion.div key="analysis" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
                            <AnalysisResult result={analysis} onProceed={() => setStep('booking')} />
                        </motion.div>
                    )}

                    {step === 'booking' && analysis && (
                        <motion.div key="booking" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                            <BookingFlow analysis={analysis} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Reset Action */}
            {step !== 'input' && (
                <div style={{ textAlign: 'center', marginTop: '5rem', position: 'relative', zIndex: 1 }}>
                    <motion.button
                        whileHover={{ scale: 1.05, background: 'white' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setStep('input'); setAnalysis(null); }}
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.75rem', 
                            background: 'rgba(255,255,255,0.4)', 
                            color: 'var(--text-main)', 
                            border: '1px solid var(--border-subtle)', 
                            padding: '1rem 2rem', 
                            borderRadius: '24px', 
                            cursor: 'pointer', 
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s', 
                            fontSize: '1rem', 
                            fontWeight: 800,
                            boxShadow: '0 10px 25px -10px rgba(0,0,0,0.05)'
                        }}
                    >
                        <RefreshCw size={18} /> Re-initialize Protocol
                    </motion.button>
                </div>
            )}

            <AlertModal 
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </div>
    );
};

export default MainApp;
