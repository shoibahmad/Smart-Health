import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Activity, Zap } from 'lucide-react';

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
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            background: 'radial-gradient(circle at 100% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 0% 100%, var(--accent-glow) 0%, transparent 40%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Accents */}
            <div style={{ position: 'absolute', top: '15%', right: '15%', width: '450px', height: '450px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: '350px', height: '350px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.08, zIndex: 0 }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card"
                style={{
                    maxWidth: '440px', width: '100%', padding: '2.5rem', borderRadius: '30px', background: 'white',
                    border: '1px solid var(--border-medium)', boxShadow: '0 40px 100px -30px rgba(15, 23, 42, 0.12)', position: 'relative', zIndex: 1
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '56px', height: '56px', background: 'var(--bg-color)', borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                        margin: '0 auto 1.25rem', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)'
                    }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
                        Welcome <span className="text-gradient">Back</span>
                    </h2>
                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: 600 }}>Secure access to the clinical hub.</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{
                        background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '14px', padding: '1rem',
                        marginBottom: '1.5rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}>
                        <Zap size={18} /> {error}
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="btn-secondary"
                    style={{
                        width: '100%', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.75rem', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem'
                    }}
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 20, height: 20 }} />
                    Continue with Google Vault
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                    <span style={{ color: 'var(--text-soft)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Authentication Protocol</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                </div>

                <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                        <input
                            type="email" placeholder="Practitioner Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            style={{ height: '52px', width: '100%', paddingLeft: '48px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                        <input
                            type={showPassword ? 'text' : 'password'} placeholder="Security Key" value={password} onChange={(e) => setPassword(e.target.value)} required
                            style={{ height: '52px', width: '100%', paddingLeft: '48px', paddingRight: '48px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                        />
                        <button
                            type="button" onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', padding: '6px' }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                        <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none' }}>
                            Recovery Request?
                        </Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" disabled={loading} className="btn-primary"
                        style={{ width: '100%', height: '56px', borderRadius: '14px', fontWeight: 900, fontSize: '1rem', boxShadow: '0 20px 40px -10px var(--primary-glow)' }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: 600 }}>
                    New to the network? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 900, marginLeft: '0.5rem' }}>Initialize Profile</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
