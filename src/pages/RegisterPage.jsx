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

    // Role selection state
    const [role, setRole] = useState('patient');
    const [showGoogleModal, setShowGoogleModal] = useState(false);

    // Normal Google Login (Triggered after modal role selection)
    const proceedWithGoogleLogin = async (selectedRole) => {
        try {
            setLoading(true);
            setShowGoogleModal(false);
            await googleLogin(selectedRole);
            navigate('/');
        } catch (err) {
            setError("Google login failed. Please try again.");
            setLoading(false);
        }
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
            await signup(email, password, { full_name: fullName, role: role });
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
            {/* Google Role Selection Modal */}
            {showGoogleModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card fade-in" style={{ padding: '2.5rem', maxWidth: '400px', width: '90%', textAlign: 'center', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Select Your Role</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Are you joining as a Patient or a Doctor?</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={() => proceedWithGoogleLogin('patient')}
                                style={{
                                    padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary)',
                                    background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600,
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                Continue as Patient
                            </button>
                            <button
                                onClick={() => proceedWithGoogleLogin('doctor')}
                                style={{
                                    padding: '1rem', borderRadius: '12px', border: '1px solid #8b5cf6',
                                    background: '#8b5cf6', color: 'white', cursor: 'pointer', fontWeight: 600,
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                Continue as Doctor
                            </button>
                            <button
                                onClick={() => proceedWithGoogleLogin('superadmin')}
                                style={{
                                    padding: '1rem', borderRadius: '12px', border: '1px solid var(--danger)',
                                    background: 'var(--danger)', color: 'white', cursor: 'pointer', fontWeight: 600,
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                Continue as Super Admin
                            </button>
                            <button
                                onClick={() => setShowGoogleModal(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginTop: '1rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem', background: '#ffffff', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-md)', borderRadius: '16px' }}>
                <>
                    <h1 style={{ marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-main)' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                        Join Smart Health today
                    </p>

                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            marginBottom: '1.5rem',
                            color: 'var(--danger)',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Google Login Trigger */}
                    <button
                        onClick={() => setShowGoogleModal(true)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '10px',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            border: '1px solid var(--glass-border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            marginBottom: '1.5rem',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
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
                        {/* Role Selection Toggle */}
                        <div style={{
                            display: 'flex',
                            background: '#f1f3f4',
                            borderRadius: '12px',
                            padding: '6px',
                            marginBottom: '1.5rem',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <button
                                type="button"
                                onClick={() => setRole('patient')}
                                style={{
                                    flex: 1, padding: '0.65rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                                    background: role === 'patient' ? '#ffffff' : 'transparent',
                                    color: role === 'patient' ? 'var(--primary)' : 'var(--text-muted)',
                                    boxShadow: role === 'patient' ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                Patient
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('doctor')}
                                style={{
                                    flex: 1, padding: '0.65rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                                    background: role === 'doctor' ? '#ffffff' : 'transparent',
                                    color: role === 'doctor' ? '#8b5cf6' : 'var(--text-muted)',
                                    boxShadow: role === 'doctor' ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                Doctor
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('superadmin')}
                                style={{
                                    flex: 1, padding: '0.65rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                                    background: role === 'superadmin' ? '#ffffff' : 'transparent',
                                    color: role === 'superadmin' ? 'var(--danger)' : 'var(--text-muted)',
                                    boxShadow: role === 'superadmin' ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                Admin
                            </button>
                        </div>

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
                                    background: '#ffffff',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-main)',
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
                                    background: '#ffffff',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-main)',
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
                                    background: '#ffffff',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-main)',
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
                                fontSize: '0.95rem',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                            Sign In
                        </Link>
                    </p>
                </>
            </div>
        </div>
    );
};

export default RegisterPage;
