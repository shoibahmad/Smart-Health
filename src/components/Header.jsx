import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Menu, X, LogOut, User, ChevronDown,
    Stethoscope, Shield, Heart, Calendar, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Heart },
        { name: 'Checkup', path: '/checkup', icon: Stethoscope },
        { name: 'Services', path: '/#services', icon: Calendar },
        { name: 'About Project', path: '#', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), icon: Info }
    ];

    const getRoleColor = (role) => {
        switch (role) {
            case 'superadmin':
            case 'admin':
            case 'superuser': return '#f472b6';
            case 'doctor': return '#34d399';
            default: return '#60a5fa';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'superadmin':
            case 'admin':
            case 'superuser': return 'Admin';
            case 'doctor': return 'Doctor';
            default: return 'Patient';
        }
    };

    return (
        <>
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: scrolled ? '0.75rem 2rem' : '1rem 2rem',
                background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
                boxShadow: scrolled ? 'var(--shadow-sm)' : 'none'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                width: '40px',
                                height: '40px',
                                background: 'var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)'
                            }}>
                            <Activity size={24} />
                        </motion.div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--text-main)',
                                letterSpacing: '-0.5px'
                            }}>
                                Smart Health
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                                AI Healthcare
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="desktop-nav" style={{ display: 'none', gap: '0.5rem', background: 'transparent', padding: '0.2rem' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                style={{
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#f1f3f4';
                                    e.currentTarget.style.color = 'var(--text-main)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }}
                                onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick(); } : undefined}
                            >
                                <link.icon size={18} />
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <style>{`
                        @media (min-width: 768px) {
                            .desktop-nav { display: flex !important; }
                            .mobile-toggle { display: none !important; }
                        }
                    `}</style>

                    {/* Actions */}
                    <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {/* Role-based Dashboard Links */}
                                {user.role === 'patient' && (
                                    <Link to="/dashboard" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        color: '#0ea5e9', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
                                        padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.1)'
                                    }}>
                                        <Activity size={16} /> Dashboard
                                    </Link>
                                )}
                                {user.role === 'doctor' && (
                                    <Link to="/doctor" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        color: '#34d399', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
                                        padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.1)'
                                    }}>
                                        <Stethoscope size={16} /> Dashboard
                                    </Link>
                                )}
                                {['superadmin', 'admin', 'superuser'].includes(user.role) && (
                                    <Link to="/admin" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        color: '#f472b6', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
                                        padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(244, 114, 182, 0.1)'
                                    }}>
                                        <Shield size={16} /> Admin
                                    </Link>
                                )}

                                {/* Profile Dropdown */}
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            background: '#ffffff',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '8px',
                                            padding: '0.4rem 0.8rem 0.4rem 0.5rem',
                                            color: 'var(--text-main)',
                                            cursor: 'pointer',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: getRoleColor(user.role),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.85rem', fontWeight: 700, color: 'white'
                                        }}>
                                            {user.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                                            {user.full_name?.split(' ')[0]}
                                        </span>
                                        <ChevronDown size={16} color="var(--text-muted)" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '110%',
                                                    right: 0,
                                                    background: '#ffffff',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '12px',
                                                    padding: '0.5rem',
                                                    minWidth: '180px',
                                                    boxShadow: 'var(--shadow-md)'
                                                }}
                                            >
                                                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{user.full_name}</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: getRoleColor(user.role), fontWeight: 600 }}>{getRoleLabel(user.role)}</p>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        padding: '0.75rem 1rem',
                                                        color: 'var(--danger)',
                                                        cursor: 'pointer',
                                                        borderRadius: '6px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 500,
                                                        boxShadow: 'none'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Link to="/login" style={{
                                    color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                                    padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f3f4'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >Sign In</Link>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '0.6rem 1.25rem',
                                            borderRadius: '25px',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                        }}>
                                        Get Started
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <motion.button
                        className="mobile-toggle"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            background: '#f1f3f4',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            color: 'var(--text-main)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: 'none'
                        }}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                overflow: 'hidden',
                                background: '#ffffff',
                                borderTop: '1px solid var(--glass-border)',
                                marginTop: '1rem',
                                borderRadius: '8px',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '0.75rem' }}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick(); setMobileMenuOpen(false); } : () => setMobileMenuOpen(false)}
                                        style={{
                                            color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.1rem',
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.75rem 1rem', borderRadius: '8px',
                                            background: '#f8f9fa',
                                            fontWeight: 500
                                        }}
                                    >
                                        <link.icon size={20} style={{ color: 'var(--primary)' }} />
                                        {link.name}
                                    </Link>
                                ))}
                                {user && (
                                    <>
                                        {user.role === 'patient' && (
                                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0ea5e9', textDecoration: 'none', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f0f9ff', borderRadius: '8px', fontWeight: 600 }}>
                                                <Activity size={20} /> My Dashboard
                                            </Link>
                                        )}
                                        {user.role === 'doctor' && (
                                            <Link to="/doctor" onClick={() => setMobileMenuOpen(false)} style={{ color: '#34d399', textDecoration: 'none', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ecfdf5', borderRadius: '8px', fontWeight: 600 }}>
                                                <Stethoscope size={20} /> Doctor Dashboard
                                            </Link>
                                        )}
                                        {['superadmin', 'admin', 'superuser'].includes(user.role) && (
                                            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#f472b6', textDecoration: 'none', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fdf2f8', borderRadius: '8px', fontWeight: 600 }}>
                                                <Shield size={20} /> Admin Portal
                                            </Link>
                                        )}
                                    </>
                                )}
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                    {user ? (
                                        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ width: '100%', background: '#fef2f2', color: 'var(--danger)', boxShadow: 'none' }}>
                                            <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Sign Out
                                        </button>
                                    ) : (
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <button style={{ width: '100%' }}>Sign In</button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Click outside to close profile dropdown */}
            {profileOpen && (
                <div
                    onClick={() => setProfileOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                />
            )}
        </>
    );
};

export default Header;
