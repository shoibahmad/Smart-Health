import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
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
            paddingTop: '100px',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--bg-color)'
        }}>
            <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem', background: '#ffffff', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-md)', borderRadius: '16px' }}>

                {step === 'email' && (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                            <ArrowLeft size={18} /> Back to login
                        </Link>

                        <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Forgot Password?</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Enter your email and we'll send you a link to reset your password.
                        </p>

                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.5rem', color: 'var(--danger)' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleResetPassword}>
                            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 0.875rem 0.875rem 44px',
                                        borderRadius: '10px',
                                        background: '#ffffff',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '10px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'success' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
                        <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Check your email</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            We have sent a password reset link to <strong style={{ color: 'var(--primary)' }}>{email}</strong>
                        </p>
                        <Link
                            to="/login"
                            style={{
                                display: 'inline-block',
                                padding: '0.875rem 2rem',
                                borderRadius: '10px',
                                background: 'var(--primary)',
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 600,
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
