import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const RegisterPage = () => {
    const { googleLogin, signup } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await googleLogin();
            navigate('/');
        } catch (err) {
            setError("Google login failed. Please try again.");
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signup(email, password, { full_name: fullName, role: 'patient' });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
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
            padding: '2rem'
        }}>
            <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
                <>
                    <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                        Join Smart Health today
                    </p>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            marginBottom: '1.5rem',
                            color: '#f87171',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Google Login */}
                    <button
                        onClick={() => handleGoogleLogin()}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '10px',
                            background: 'white',
                            color: '#333',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 20, height: 20 }} />
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                    </div>

                    <form onSubmit={handleRegister}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 0.875rem 0.875rem 44px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
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
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 44px 0.875rem 44px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 0.875rem 0.875rem 44px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
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
                                background: 'linear-gradient(90deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem'
                            }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>
                            Sign In
                        </Link>
                    </p>
                </>
            </div>
        </div>
    );
};

export default RegisterPage;
