import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState('email'); // 'email', 'success'

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
            setStep('success');
        } catch (err) {
            console.error("Reset password error:", err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            paddingTop: '120px',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'radial-gradient(circle at 0% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent-glow) 0%, transparent 40%)'
        }}>
            {/* Background Accents */}
            <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card" 
                style={{ 
                    maxWidth: '460px', width: '100%', padding: '3.5rem', 
                    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(30px)',
                    border: '1px solid var(--border-subtle)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)',
                    borderRadius: '40px', position: 'relative', zIndex: 1
                }}
            >

                {step === 'email' && (
                    <>
                        <Link to="/login" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', textDecoration: 'none', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <ArrowLeft size={16} /> Secure Portal
                        </Link>

                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 1rem', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
                            Reset <span style={{ color: 'var(--primary)' }}>Access</span>
                        </h1>
                        <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.6 }}>
                            Initiate a secure credential recovery protocols. We will transmit a cryptographically signed reset link to your primary medical record email.
                        </p>

                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '1rem', marginBottom: '2rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Shield size={18} /> {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleResetPassword}>
                            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                                <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', zIndex: 2 }}>
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Clinical email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '1.1rem 1.1rem 1.1rem 54px', borderRadius: '18px', 
                                        background: 'white', border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-main)', fontSize: '1rem', fontWeight: 600, outline: 'none', transition: 'all 0.2s ease'
                                    }}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '1.1rem', borderRadius: '18px', 
                                    background: 'var(--primary)', color: 'white', border: 'none',
                                    cursor: 'pointer', fontWeight: 900, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase',
                                    boxShadow: '0 20px 40px -10px var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                                }}
                            >
                                {loading ? 'Initializing...' : 'Transmit Reset Link'}
                            </motion.button>
                        </form>
                    </>
                )}

                {step === 'success' && (
                    <div style={{ textAlign: 'center' }}>
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-plus)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}
                        >
                            <Mail size={40} />
                        </motion.div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 1rem', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>Check your inbox</h1>
                        <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>
                            A secure entry point has been dispatched to <strong style={{ color: 'var(--primary)', display: 'block', marginTop: '0.5rem' }}>{email}</strong>
                        </p>
                        <Link
                            to="/login"
                            style={{
                                display: 'inline-block', width: '100%', padding: '1.1rem', borderRadius: '18px', 
                                background: 'white', border: '1px solid var(--border-subtle)', color: 'var(--text-main)',
                                textDecoration: 'none', fontWeight: 900, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                            }}
                        >
                            Back to Secure Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
