import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Twitter, Github, Linkedin,
    Heart, Stethoscope, Shield, ArrowUpRight, Info, Terminal, Mail, Phone, MapPin, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: 'Platform Infrastructure',
            links: [
                { name: 'About SmartHealth', path: '/about-project' },
                { name: 'Privacy Protocol', path: '/privacy-policy' },
                { name: 'Terms of Service', path: '/terms-conditions' },
            ]
        }
    ];

    const socialLinks = [
        { icon: Twitter, href: '#' },
        { icon: Linkedin, href: '#' },
        { icon: Github, href: '#' },
    ];

    return (
        <footer style={{
            background: 'white',
            padding: '5rem 2rem 3rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: 'auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Aesthetic Background Elements */}
            <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '400px', height: '400px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, zIndex: 0 }} />
            
            <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1600px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1.5fr',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Identifier */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '42px', height: '42px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', boxShadow: '0 10px 20px -5px var(--primary-glow)'
                            }}>
                                <Shield size={20} />
                            </div>
                            <span style={{
                                fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', 
                                letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif'
                            }}>
                                Smart<span style={{ color: 'var(--primary)' }}>Health</span>
                            </span>
                        </Link>
                        
                        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '300px', fontWeight: 600 }}>
                            Empowering medicine through decentralized intelligence and high-fidelity AI diagnostics.
                        </p>
 
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ y: -3, scale: 1.05, background: 'var(--primary)', color: 'white' }}
                                    style={{
                                        width: '38px', height: '38px', borderRadius: '10px',
                                        background: 'var(--bg-color)', border: '1px solid var(--border-subtle)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-soft)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    <social.icon size={16} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
 
                    {/* Navigation Groups */}
                    {sections.map((section, i) => (
                        <div key={i}>
                            <h4 style={{ 
                                fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', 
                                letterSpacing: '1.5px', color: 'var(--text-main)', marginBottom: '1.5rem' 
                            }}>
                                {section.title}
                            </h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {section.links.map((link, j) => (
                                    <li key={j} style={{ position: 'relative' }} className="footer-link-wrapper">
                                        <Link
                                            to={link.path}
                                            style={{
                                                color: 'var(--text-soft)', textDecoration: 'none',
                                                fontSize: '0.9rem', fontWeight: 700, display: 'flex',
                                                alignItems: 'center', gap: '0.75rem', transition: 'all 0.3s ease'
                                            }}
                                            className="footer-nav-link"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
 
                    {/* Developer & Institution Credits */}
                    <div>
                        <h4 style={{ 
                            fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', 
                            letterSpacing: '1.5px', color: 'var(--text-main)', marginBottom: '1.5rem' 
                        }}>
                            Engineering Credits
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>M. Adnan Khan</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Muzammil Iftikhar</div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 700 }}>
                                    <MapPin size={14} style={{ color: 'var(--primary)' }} /> Integral Uni.
                                </div>
                                <a href="mailto:ak700@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                                    <Mail size={14} style={{ color: 'var(--primary)' }} /> Developer Email
                                </a>
                            </div>
 
                            <div className="glass-card" style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--primary-plus)', border: '1px solid var(--border-subtle)' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, lineHeight: 1.4 }}>
                                    Proprietary intelligence developed at Integral University.
                                </p>
                            </div>
                    </div>
                </div>
            </div>
 
                <style>{`
                    .footer-nav-link:hover {
                        color: var(--primary) !important;
                        transform: translateX(5px);
                    }
                    @media (max-width: 1200px) {
                        footer > .container > div {
                            grid-template-columns: 1fr 1fr !important;
                            gap: 3rem !important;
                        }
                    }
                    @media (max-width: 768px) {
                        footer > .container > div {
                            grid-template-columns: 1fr !important;
                            gap: 2.5rem !important;
                        }
                    }
                `}</style>
 
                {/* Bottom Compliance Bar */}
                <div style={{
                    paddingTop: '2.5rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 700 }}>
                        © {currentYear} Smart Health AI Systems
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {['FDA Certified', 'HIPAA compliant', 'ISO 27001'].map(badge => (
                            <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={12} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {badge}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
