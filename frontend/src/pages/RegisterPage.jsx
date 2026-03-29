import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Shield, Activity, Zap } from 'lucide-react';

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
    const [role, setRole] = useState('patient');
    const [showGoogleModal, setShowGoogleModal] = useState(false);

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
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
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
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            background: 'radial-gradient(circle at 0% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent-glow) 0%, transparent 40%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Aesthetic Backgrounds */}
            <div style={{ position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />

            {/* Google Role Selection Modal */}
            <AnimatePresence>
                {showGoogleModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: '1.5rem'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-card"
                            style={{
                                padding: '2.5rem', maxWidth: '440px', width: '100%', textAlign: 'center', background: 'white',
                                borderRadius: '30px', border: '1px solid var(--border-medium)', boxShadow: '0 40px 80px -20px rgba(15, 23, 42, 0.15)'
                            }}
                        >
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 1.5rem'
                            }}>
                                <Shield size={28} />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Verify Your Profile</h2>
                            <p style={{ color: 'var(--text-soft)', marginBottom: '2rem', fontWeight: 600, lineHeight: 1.5, fontSize: '0.95rem' }}>Select your role within the SmartHealth diagnostic grid.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => proceedWithGoogleLogin('patient')} className="btn-primary" style={{ height: '54px', borderRadius: '14px', fontWeight: 800, fontSize: '1rem' }}>
                                    Access as Patient
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => proceedWithGoogleLogin('doctor')} className="btn-secondary" style={{ height: '54px', borderRadius: '14px', fontWeight: 800, fontSize: '1rem' }}>
                                    Connect as Specialist
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => proceedWithGoogleLogin('superadmin')} className="btn-secondary" style={{ height: '54px', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' }}>
                                    Administrative Override
                                </motion.button>
                                <button onClick={() => setShowGoogleModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', marginTop: '1rem', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                                    Abandon Request
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '440px', padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '40px', border: '1px solid var(--border-medium)', boxShadow: '0 40px 100px -30px rgba(15, 23, 42, 0.1)', position: 'relative', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        margin: '0 auto 1.5rem', boxShadow: '0 10px 20px -5px var(--primary-glow)'
                    }}>
                        <Activity size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)', letterSpacing: '-1px' }}>
                        Join Smart<span className="text-gradient">Health</span>
                    </h2>
                    <p style={{ color: 'var(--text-soft)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Create your unified medical profile</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
                        background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '14px', padding: '1rem',
                        marginBottom: '1.5rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}>
                        <Zap size={18} /> {error}
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowGoogleModal(true)}
                    className="btn-secondary"
                    style={{
                        width: '100%', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.75rem', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem'
                    }}
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 20, height: 20 }} />
                    Sync with Google Identifier
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                    <span style={{ color: 'var(--text-soft)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Enterprise SSO</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: '14px', padding: '4px', border: '1px solid var(--border-subtle)' }}>
                        {['patient', 'doctor', 'superadmin'].map((r) => (
                            <button
                                key={r} type="button" onClick={() => setRole(r)}
                                style={{
                                    flex: 1, padding: '0.5rem', border: 'none', borderRadius: '10px', cursor: 'pointer',
                                    fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px',
                                    transition: 'all 0.3s',
                                    background: role === r ? 'white' : 'transparent',
                                    color: role === r ? 'var(--primary)' : 'var(--text-soft)',
                                    boxShadow: role === r ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                        <input
                            type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                            style={{ height: '52px', width: '100%', paddingLeft: '48px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                        <input
                            type="email" placeholder="Verification Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            style={{ height: '52px', width: '100%', paddingLeft: '48px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'} placeholder="Secure Access" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ height: '52px', width: '100%', paddingLeft: '48px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'} placeholder="Verify Patch" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                style={{ height: '52px', width: '100%', paddingLeft: '48px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', padding: '6px' }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" disabled={loading} className="btn-primary"
                        style={{ width: '100%', height: '56px', borderRadius: '14px', fontWeight: 900, fontSize: '1rem', boxShadow: '0 20px 40px -10px var(--primary-glow)' }}
                    >
                        {loading ? 'SYNCING...' : 'INITIALIZE ACCOUNT'}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Already registered? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 900, marginLeft: '0.5rem' }}>Return to Hub</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
