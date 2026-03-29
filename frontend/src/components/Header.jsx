import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Menu, X, LogOut, User, ChevronDown,
    Stethoscope, Shield, Heart, Calendar, Info, Terminal, Zap, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertModal from './AlertModal';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setProfileOpen(false);
            setLogoutConfirmOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Logout navigation failed", error);
            window.location.href = '/';
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Heart },
        { name: 'Checkup', path: '/checkup', icon: Activity },
        { name: 'Services', path: '/#services', icon: Stethoscope },
        { name: 'API Docs', path: '/api-docs', icon: Terminal },
        { name: 'About', path: '/about-project', icon: Info }
    ];

    const getRoleColor = (role) => {
        const roles = {
            superadmin: 'linear-gradient(135deg, #f43f5e, #fb7185)',
            admin: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            doctor: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            patient: 'linear-gradient(135deg, #10b981, #34d399)'
        };
        return roles[role] || roles.patient;
    };

    const navLinkStyle = {
        color: 'var(--text-muted)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 700,
        padding: '0.6rem 1rem',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        letterSpacing: '0.3px'
    };

    return (
        <>
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: 'var(--header-height)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
            boxShadow: scrolled ? '0 10px 40px -10px rgba(0,0,0,0.08)' : 'none',
            padding: '0 1rem'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1600px' }}>
                {/* Logo Section */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        boxShadow: '0 8px 16px -4px var(--primary-glow)'
                    }}>
                        <Activity size={22} />
                    </div>
                    <span style={{
                        fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)',
                        fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px'
                    }}>
                        Smart<span style={{ color: 'var(--primary)' }}>Health</span>
                    </span>
                </Link>

                {/* Central Navigation */}
                <nav className="desktop-nav" style={{ display: 'none', gap: '0.25rem', padding: '0.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.5)' }}>
                    {navLinks.map((link) => (
                        <div key={link.name} style={{ position: 'relative' }} className="nav-item-container">
                            <Link
                                to={link.path}
                                className="nav-item"
                                style={{
                                    ...navLinkStyle,
                                    background: 'transparent',
                                    color: 'var(--text-main)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 800
                                }}
                            >
                                <link.icon size={14} style={{ color: 'var(--primary)', opacity: 0.8 }} />
                                {link.name}
                            </Link>
                            
                            {/* Hover/Tap Content Dropdown */}
                            {(link.name === 'Services' || link.name === 'About') && (
                                <div className="nav-dropdown" style={{
                                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%) translateY(10px)',
                                    minWidth: '240px', background: 'white', padding: '1.5rem', borderRadius: '24px',
                                    border: '1px solid var(--border-subtle)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                    opacity: 0, visibility: 'hidden', transition: 'all 0.3s ease', zIndex: 100
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {link.name === 'Services' ? 'Clinical Core' : 'Project Alpha'}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: 1.5, fontWeight: 600 }}>
                                            {link.name === 'Services' 
                                                ? 'Access AI triage, secure patient vaults, and professional diagnostic tools.' 
                                                : 'Researching the intersection of neural networks and clinical healthcare.'}
                                        </p>
                                        <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Explore Segment <ExternalLink size={12} />
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Action Section */}
                <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to={user.role === 'patient' ? '/dashboard' : user.role === 'doctor' ? '/doctor' : '/admin'} style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ 
                                        padding: '0.5rem 1.25rem', 
                                        borderRadius: '12px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 900,
                                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                        color: 'white',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 10px 20px -5px var(--primary-glow)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Zap size={14} fill="white" /> Dashboard
                                </motion.button>
                            </Link>

                            <div style={{ position: 'relative' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    style={{
                                        background: 'white',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: '12px',
                                        padding: '0.3rem 0.6rem 0.3rem 0.3rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '10px',
                                        background: getRoleColor(user.role),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, color: 'white', fontSize: '0.9rem',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        {user.full_name?.[0].toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-main)' }}>Profile</span>
                                    <ChevronDown size={12} style={{ color: 'var(--text-soft)', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                                </motion.button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            className="glass-card"
                                            style={{
                                                position: 'absolute',
                                                top: 'calc(100% + 12px)',
                                                right: 0,
                                                minWidth: '280px',
                                                padding: '1.25rem',
                                                zIndex: 1100,
                                                borderRadius: '20px',
                                                background: 'white',
                                                border: '1px solid var(--border-subtle)',
                                                boxShadow: '0 30px 60px -12px rgba(0,0,0,0.18)'
                                            }}
                                        >
                                            <div style={{ marginBottom: '1.25rem', padding: '0.5rem 0.5rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                                <p style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{user.full_name}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-soft)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{user.role} Verified</p>
                                                </div>
                                            </div>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                <button
                                                    onClick={() => setLogoutConfirmOpen(true)}
                                                    style={{ 
                                                        ...navLinkStyle, 
                                                        width: '100%', 
                                                        color: '#ef4444', 
                                                        background: 'rgba(239, 68, 68, 0.04)', 
                                                        marginTop: '0.75rem', 
                                                        padding: '0.8rem',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(239, 68, 68, 0.1)',
                                                        fontWeight: 900
                                                    }}
                                                >
                                                    <LogOut size={14} /> Sign Out System
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/login" style={{ textDecoration: 'none', fontWeight: 900, fontSize: '0.8rem', color: 'var(--text-main)' }}>Login</Link>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ 
                                        padding: '0.6rem 1.25rem', 
                                        borderRadius: '12px', 
                                        fontWeight: 900, 
                                        fontSize: '0.8rem',
                                        background: 'var(--text-main)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Initialize Account
                                </motion.button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle Integration */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="mobile-toggle"
                    style={{
                        display: 'flex', padding: '0.5rem', borderRadius: '10px', background: 'white', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.button>
            </div>

            <style>{`
                @media (min-width: 992px) {
                    .desktop-nav { display: flex !important; }
                    .mobile-toggle { display: none !important; }
                }
                .nav-item:hover {
                    color: var(--primary) !important;
                    background: white !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .nav-item-container:hover .nav-dropdown {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: translateX(-50%) translateY(0) !important;
                }
            `}</style>

            {/* Premium Mobile Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed', inset: 0, top: '64px', background: 'white', zIndex: 900, padding: '2rem'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 900, padding: '1.5rem', borderRadius: '24px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)'
                                    }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                        <link.icon size={24} style={{ color: 'var(--primary)' }} />
                                    </div>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
        
        <AlertModal
            isOpen={logoutConfirmOpen}
            onClose={() => setLogoutConfirmOpen(false)}
            onConfirm={handleLogout}
            type="confirm"
            title="System De-authentication"
            message="Confirm identity withdrawal. This will terminate your current encrypted clinical session."
            confirmText="Terminate Session"
            cancelText="Maintain Access"
        />

        {/* Dynamic Spacing */}
        <div style={{ height: 'var(--header-height)' }} />
        </>
    );
};

export default Header;
