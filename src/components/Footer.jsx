import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Twitter, Github, Linkedin,
    Heart, Stethoscope, Shield, ArrowUpRight, X, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showAbout, setShowAbout] = useState(false);

    const quickLinks = [
        { name: 'Book Checkup', path: '/checkup', icon: Stethoscope },
        { name: 'Our Services', path: '/#services', icon: Heart },
        { name: 'About Project', action: () => setShowAbout(true), icon: Info },
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Github, href: '#', label: 'GitHub' },
    ];

    return (
        <footer style={{
            background: '#f8f9fa',
            padding: '5rem 2rem 2rem',
            borderTop: '1px solid var(--glass-border)',
            marginTop: 'auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Removed Background Glow */}

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Main Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <Activity size={24} />
                            </div>
                            <div>
                                <span style={{
                                    color: 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    letterSpacing: '-0.5px'
                                }}>Smart Health</span>
                                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                                    AI Healthcare
                                </span>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '2rem' }}>
                            Revolutionizing healthcare with AI-driven diagnostics, seamless scheduling, and personalized care. Your health, our priority.
                        </p>

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    aria-label={social.label}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: '#ffffff',
                                        border: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-muted)',
                                        transition: 'all 0.2s',
                                        textDecoration: 'none'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = '#f1f3f4';
                                        e.currentTarget.style.color = 'var(--primary)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = '#ffffff';
                                        e.currentTarget.style.color = 'var(--text-muted)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{
                            color: 'var(--text-main)',
                            marginBottom: '1.75rem',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ width: '20px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                            Quick Links
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    {link.action ? (
                                        <button
                                            onClick={(e) => { e.preventDefault(); link.action(); }}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.5rem 0',
                                                transition: 'all 0.2s',
                                                fontSize: '0.95rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.color = 'var(--primary)';
                                                e.currentTarget.style.paddingLeft = '0.5rem';
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                                e.currentTarget.style.paddingLeft = '0';
                                            }}
                                        >
                                            <link.icon size={18} />
                                            {link.name}
                                            <ArrowUpRight size={14} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                                        </button>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            style={{
                                                color: 'var(--text-muted)',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.5rem 0',
                                                transition: 'all 0.2s',
                                                fontSize: '0.95rem'
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.color = 'var(--primary)';
                                                e.currentTarget.style.paddingLeft = '0.5rem';
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                                e.currentTarget.style.paddingLeft = '0';
                                            }}
                                        >
                                            <link.icon size={18} />
                                            {link.name}
                                            <ArrowUpRight size={14} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        © {currentYear} Smart Health AI. Built with{' '}
                        <Heart size={14} style={{ display: 'inline', color: 'var(--danger)', verticalAlign: 'middle' }} />
                        {' '}for better healthcare.
                    </span>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >Privacy Policy</a>
                        <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* About Modal */}
            <AnimatePresence>
                {showAbout && (
                    <div style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '1rem'
                    }} onClick={() => setShowAbout(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: '#ffffff',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                maxWidth: '600px',
                                width: '100%',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                border: '1px solid var(--glass-border)',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setShowAbout(false)}
                                style={{
                                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                                    background: '#f1f5f9', border: 'none',
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
                            >
                                <X size={18} />
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-bg)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                                }}>
                                    <Activity size={28} />
                                </div>
                                <h2 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-main)' }}>About Smart Health AI</h2>
                            </div>

                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                                Smart Health is a cutting-edge telemedicine platform designed to bridge the gap between patients and healthcare providers. By leveraging modern web technologies and Artificial Intelligence, we aim to make healthcare more accessible, efficient, and personalized.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ background: '#f8f9fa', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Stethoscope size={18} /> Dynamic Telemedicine
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                        Seamlessly book appointments with doctors based on their real-time availability and managing schedules through intuitive dashboards.
                                    </p>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Activity size={18} /> AI Disease Prediction
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                        Utilize our Machine Learning models to input symptoms and receive immediate preliminary risk assessments.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;
