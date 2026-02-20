import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Twitter, Github, Linkedin,
    Heart, Stethoscope, Shield, ArrowUpRight
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Book Checkup', path: '/checkup', icon: Stethoscope },
        { name: 'Our Services', path: '/#services', icon: Heart },
        { name: 'About Us', path: '/#about', icon: Shield },
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Github, href: '#', label: 'GitHub' },
    ];

    return (
        <footer style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 1) 100%)',
            padding: '5rem 2rem 2rem',
            borderTop: '1px solid rgba(139, 92, 246, 0.15)',
            marginTop: 'auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

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
                                width: '44px',
                                height: '44px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #10b981 100%)',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                            }}>
                                <Activity size={24} />
                            </div>
                            <div>
                                <span style={{
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '1.3rem',
                                    background: 'linear-gradient(135deg, #fff, #c4b5fd)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>Smart Health</span>
                                <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    AI Healthcare
                                </span>
                            </div>
                        </div>
                        <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '0.95rem', marginBottom: '2rem' }}>
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
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '12px',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8',
                                        transition: 'all 0.3s',
                                        textDecoration: 'none'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                        e.currentTarget.style.color = '#94a3b8';
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
                            color: 'white',
                            marginBottom: '1.75rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ width: '24px', height: '2px', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '2px' }} />
                            Quick Links
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: '#94a3b8',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.5rem 0',
                                            transition: 'all 0.2s',
                                            fontSize: '0.95rem'
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.color = '#8b5cf6';
                                            e.currentTarget.style.paddingLeft = '0.5rem';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.color = '#94a3b8';
                                            e.currentTarget.style.paddingLeft = '0';
                                        }}
                                    >
                                        <link.icon size={18} />
                                        {link.name}
                                        <ArrowUpRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        © {currentYear} Smart Health AI. Built with{' '}
                        <Heart size={14} style={{ display: 'inline', color: '#f472b6', verticalAlign: 'middle' }} />
                        {' '}for better healthcare.
                    </span>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
                        <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}
                            onMouseOver={e => e.currentTarget.style.color = '#fff'}
                            onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                        >Privacy Policy</a>
                        <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}
                            onMouseOver={e => e.currentTarget.style.color = '#fff'}
                            onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                        >Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
