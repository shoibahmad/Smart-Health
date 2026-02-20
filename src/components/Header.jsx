import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Menu, X, LogOut, User, ChevronDown,
    Stethoscope, Shield, Heart, Calendar
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
    ];

    const getRoleColor = (role) => {
        switch (role) {
            case 'superuser': return '#f472b6';
            case 'doctor': return '#34d399';
            default: return '#60a5fa';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
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
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: scrolled ? '0.75rem 2rem' : '1rem 2rem',
                background: scrolled
                    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
                    : 'transparent',
                backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
                boxShadow: scrolled ? '0 4px 30px rgba(139, 92, 246, 0.1)' : 'none'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                width: '44px',
                                height: '44px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #10b981 100%)',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                            }}>
                            <Activity size={26} />
                        </motion.div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '1.3rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #67e8f9 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.5px'
                            }}>
                                Smart Health
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                AI Healthcare
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="desktop-nav" style={{ display: 'none', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                style={{
                                    color: '#cbd5e1',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#cbd5e1';
                                }}
                            >
                                <link.icon size={16} />
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
                                {user.role === 'doctor' && (
                                    <Link to="/doctor" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        color: '#34d399', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
                                        padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.1)'
                                    }}>
                                        <Stethoscope size={16} /> Dashboard
                                    </Link>
                                )}
                                {user.role === 'superuser' && (
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
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '30px',
                                            padding: '0.4rem 0.8rem 0.4rem 0.5rem',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${getRoleColor(user.role)}, #8b5cf6)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.85rem', fontWeight: 700
                                        }}>
                                            {user.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {user.full_name?.split(' ')[0]}
                                        </span>
                                        <ChevronDown size={16} style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
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
                                                    background: 'rgba(30, 41, 59, 0.98)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                                    borderRadius: '12px',
                                                    padding: '0.5rem',
                                                    minWidth: '180px',
                                                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{user.full_name}</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: getRoleColor(user.role) }}>{getRoleLabel(user.role)}</p>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        padding: '0.75rem 1rem',
                                                        color: '#f87171',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        fontSize: '0.85rem'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)'}
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
                                    color: '#cbd5e1', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem',
                                    padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
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
                            background: 'rgba(139, 92, 246, 0.2)',
                            padding: '0.5rem',
                            borderRadius: '10px',
                            color: 'white',
                            border: '1px solid rgba(139, 92, 246, 0.3)'
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
                                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
                                borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                                marginTop: '1rem'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '0.75rem' }}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            color: 'white', textDecoration: 'none', fontSize: '1.1rem',
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.75rem 1rem', borderRadius: '10px',
                                            background: 'rgba(255,255,255,0.03)'
                                        }}
                                    >
                                        <link.icon size={20} style={{ color: '#8b5cf6' }} />
                                        {link.name}
                                    </Link>
                                ))}
                                {user && (
                                    <>
                                        {user.role === 'doctor' && (
                                            <Link to="/doctor" onClick={() => setMobileMenuOpen(false)} style={{ color: '#34d399', textDecoration: 'none', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '10px' }}>
                                                <Stethoscope size={20} /> Doctor Dashboard
                                            </Link>
                                        )}
                                        {user.role === 'superuser' && (
                                            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#f472b6', textDecoration: 'none', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(244, 114, 182, 0.1)', borderRadius: '10px' }}>
                                                <Shield size={20} /> Admin Portal
                                            </Link>
                                        )}
                                    </>
                                )}
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    {user ? (
                                        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ width: '100%', background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }}>
                                            <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Sign Out
                                        </button>
                                    ) : (
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <button style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>Sign In</button>
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
