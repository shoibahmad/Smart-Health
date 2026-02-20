import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const LoginPage = () => {
    const { googleLogin, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
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
                <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Sign in to continue to Smart Health
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

                {/* Email/Password Form */}
                <form onSubmit={handleEmailLogin}>
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

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <Link to="/forgot-password" style={{ color: '#60a5fa', fontSize: '0.9rem', textDecoration: 'none' }}>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '10px',
                            background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.95rem'
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
