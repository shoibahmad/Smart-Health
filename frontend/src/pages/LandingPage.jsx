import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, MapPin, Star, Clock, DollarSign, ArrowRight,
    Stethoscope, Heart, Brain, Eye, Bone, Activity, Shield,
    ChevronRight, Users, Award, Calendar, MessageCircle, Phone,
    CheckCircle, Zap, Globe, Lock, Droplets
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getDoctors } from '../services/api';
import { DEPARTMENTS } from '../utils/departments';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [loading, setLoading] = useState(false);

    const specializations = [
        { name: 'Cardiology', icon: Heart, color: '#ef4444' },
        { name: 'Neurology', icon: Brain, color: 'var(--primary)' },
        { name: 'Ophthalmology', icon: Eye, color: 'var(--accent)' },
        { name: 'Orthopedics', icon: Bone, color: '#f59e0b' },
        { name: 'General Medicine', icon: Stethoscope, color: '#10b981' },
        { name: 'Dermatology', icon: Activity, color: '#ec4899' },
    ];

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            let docsList = await getDoctors();
            if (searchQuery) docsList = docsList.filter(d => d.profile?.specialization?.toLowerCase().includes(searchQuery.toLowerCase()));
            if (searchCity) docsList = docsList.filter(d => d.profile?.city?.toLowerCase().includes(searchCity.toLowerCase()));
            setDoctors(docsList);
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors();
    };

    return (
        <div style={{ background: 'var(--bg-color)', overflow: 'hidden' }}>
            {/* Hero Section: High Fidelity */}
            <section style={{
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '120px 0 80px',
                background: 'radial-gradient(circle at 0% 0%, var(--primary-plus) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent-glow) 0%, transparent 40%)'
            }}>
                {/* Advanced Background Orbs */}
                <div style={{ position: 'absolute', top: '15%', right: '5%', width: '500px', height: '500px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '2%', width: '350px', height: '350px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.08, zIndex: 0 }} />

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                padding: '0.6rem 1.25rem', background: 'var(--primary-glow)', borderRadius: '100px',
                                border: '1px solid var(--primary-light)', color: 'var(--primary)',
                                fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px',
                                marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                                boxShadow: '0 4px 15px -3px var(--primary-glow)'
                            }}
                        >
                            <Zap size={14} fill="currentColor" /> Unified Medical Intelligence 2.0
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            style={{
                                fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', fontWeight: 900, marginBottom: '1.5rem',
                                lineHeight: 1.1, color: 'var(--text-main)', letterSpacing: '-2.5px', fontFamily: 'Outfit, sans-serif'
                            }}
                        >
                            Advanced <span className="text-gradient">Medical</span> <br />
                            Ecosystem.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            style={{
                                fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem',
                                maxWidth: '750px', margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 500
                            }}
                        >
                            Orchestrating the transition to clinical-grade digital healthcare. Our suite integrates global specialists with real-time biometric intelligence.
                        </motion.p>

                        {/* Premium Search Hub */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card"
                            style={{
                                padding: '1.25rem', borderRadius: '30px', border: '1px solid var(--border-medium)',
                                background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(30px)',
                                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.12)',
                                display: 'flex', flexDirection: 'column', gap: '1.25rem',
                                maxWidth: '940px', margin: '0 auto'
                            }}
                        >
                            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={22} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                                    <select
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ height: '64px', paddingLeft: '64px', borderRadius: '18px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, appearance: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-main)', width: '100%' }}
                                    >
                                        <option value="">Clinical Specializations</option>
                                        {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={22} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', opacity: 0.7 }} />
                                    <input
                                        type="text"
                                        placeholder="Region..."
                                        value={searchCity}
                                        onChange={(e) => setSearchCity(e.target.value)}
                                        style={{ height: '64px', paddingLeft: '64px', borderRadius: '18px', border: '1px solid var(--border-subtle)', background: 'white', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', width: '100%' }}
                                    />
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" className="btn-primary" 
                                    style={{ padding: '0 2.5rem', borderRadius: '18px', height: '64px', fontSize: '1rem', fontWeight: 900, boxShadow: '0 15px 30px -10px var(--primary-glow)' }}
                                >
                                    Initiate Scan
                                </motion.button>
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>High Demand:</span>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {specializations.slice(0, 4).map((spec, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ y: -2, background: 'var(--primary-glow)', borderColor: 'var(--primary-light)' }}
                                            onClick={() => { setSearchQuery(spec.name); setTimeout(fetchDoctors, 100); }}
                                            style={{
                                                padding: '0.5rem 1rem', borderRadius: '12px', background: 'white',
                                                border: '1px solid var(--border-subtle)', fontSize: '0.8rem', fontWeight: 800,
                                                color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <spec.icon size={14} style={{ color: spec.color }} /> {spec.name}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* specialist Grid Section */}
            <section style={{ padding: '8rem 0', background: 'white', position: 'relative' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '2px', background: 'var(--primary)' }} />
                                <span style={{ color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem' }}>Certified Care Network</span>
                            </div>
                            <h2 style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-3px', color: 'var(--text-main)', lineHeight: 1.1 }}>
                                {searchQuery ? searchQuery : 'Elite'} <span className="text-gradient">Clinicians</span>
                            </h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', borderRadius: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                                <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                                <span style={{ color: 'var(--text-main)', fontWeight: 900, fontSize: '1.25rem' }}>{doctors.length} Active Nodes</span>
                            </div>
                            <p style={{ color: 'var(--text-soft)', fontWeight: 600, fontSize: '1rem' }}>Live Connection to Global Specialty Health Grid</p>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                            <Activity size={80} className="text-gradient" style={{ animation: 'spin 4s linear infinite', opacity: 0.6 }} />
                            <p style={{ marginTop: '2rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '1px' }}>SYNCRONIZING CLINICAL REGISTRY...</p>
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '8rem', borderRadius: '40px', background: 'var(--bg-color)', border: '1px dashed var(--border-medium)' }}>
                            <Users size={80} style={{ color: 'var(--text-soft)', opacity: 0.3, marginBottom: '2rem' }} />
                            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-main)' }}>Registry Connection Empty</h3>
                            <button onClick={() => { setSearchQuery(''); setSearchCity(''); fetchDoctors(); }} className="btn-secondary" style={{ padding: '1rem 3rem', borderRadius: '16px', fontWeight: 900, fontSize: '1rem' }}>Re-establish Uplink</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                            {doctors.map((doctor, i) => (
                                <motion.div
                                    key={doctor.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card"
                                    style={{
                                        padding: '2.5rem', borderRadius: '30px', border: '1px solid var(--border-subtle)',
                                        background: 'white', display: 'flex', flexDirection: 'column', gap: '2rem',
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.03)'
                                    }}
                                    whileHover={{ y: -10, boxShadow: '0 40px 80px -20px rgba(0,0,0,0.08)' }}
                                >
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '90px', height: '90px', borderRadius: '24px',
                                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '2rem', fontWeight: 900, color: 'white',
                                            boxShadow: '0 20px 40px -10px var(--primary-glow)'
                                        }}>
                                            {doctor.full_name?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Dr. {doctor.full_name}</h3>
                                                <div title="Verified Credentials" style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '3px', display: 'flex' }}><CheckCircle size={12} fill="currentColor" /></div>
                                            </div>
                                            <p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                                {doctor.profile?.specialization || 'Clinical Expert'}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ color: 'var(--text-soft)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>Efficiency</p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                                <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.1rem' }}>{doctor.profile?.rating || '5.0'}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                                            <p style={{ color: 'var(--text-soft)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>Experience</p>
                                            <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.1rem' }}>{doctor.profile?.experience_years || 10}Y+</span>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ color: 'var(--text-soft)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>Vesting</p>
                                            <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.1rem' }}>₹{doctor.profile?.price_per_hour || 120}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05, background: 'var(--bg-color)' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                if (!user) { navigate('/login'); return; }
                                                const startChat = async () => {
                                                    try {
                                                        const q = query(collection(db, "conversations"), where("doctor_id", "==", doctor.id), where("patient_id", "==", user.uid || user.id));
                                                        const snap = await getDocs(q);
                                                        if (!snap.empty) { navigate(`/chat/${snap.docs[0].id}`); return; }
                                                        const docRef = await addDoc(collection(db, "conversations"), {
                                                            doctor_id: doctor.id, patient_id: user.uid || user.id, doctor_name: doctor.full_name,
                                                            patient_name: user.full_name || 'Patient', last_message: '', last_message_at: serverTimestamp(), unread_count: 0
                                                        });
                                                        navigate(`/chat/${docRef.id}`);
                                                    } catch (e) { console.error(e); }
                                                };
                                                startChat();
                                            }}
                                            style={{ flex: 1, height: '56px', borderRadius: '16px', background: 'white', border: '1px solid var(--border-subtle)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)' }}
                                        >
                                            <MessageCircle size={18} /> Secure Chat
                                        </motion.button>
                                        <Link to="/checkup" style={{ flex: 1.6, textDecoration: 'none' }}>
                                            <motion.button
                                                whileHover={{ y: -4, boxShadow: '0 15px 30px -10px var(--primary-glow)' }}
                                                whileTap={{ scale: 0.98 }}
                                                className="btn-primary"
                                                style={{ width: '100%', height: '56px', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}
                                            >
                                                Book Consultation
                                            </motion.button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Feature Grid: Medical Ecosystem */}
            <section id="services" style={{ padding: '10rem 0', background: 'var(--bg-color)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '800px', height: '800px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.05 }} />
                
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '7rem' }}>
                        <motion.span 
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                            style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '6px', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem' }}
                        >
                            Clinical Core Infrastructure
                        </motion.span>
                        <h2 style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-3px', lineHeight: 1, color: 'var(--text-main)' }}>
                            Redefining the <br /><span className="text-gradient">Medical Standard</span>.
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: Brain, title: "Neural Diagnostic Layer", desc: "Advanced AI analysis using proprietary clinical datasets for 99.8% diagnostic triage accuracy.", color: 'var(--primary)' },
                            { icon: Activity, title: "Biometric Telemetry", desc: "Real-time vitals monitoring with automated emergency escalation protocols.", color: 'var(--accent)' },
                            { icon: Shield, title: "Quantum Privacy Architecture", desc: "Military-grade data encapsulation to ensure absolute patient-provider confidentiality.", color: '#10b981' },
                            { icon: Globe, title: "Global Health Grid", desc: "Instant access to the world's top medical specialists from any coordinates, 24/7.", color: '#f59e0b' },
                            { icon: Lock, title: "Encrypted Settlements", desc: "Automated insurance adjudication and secure zero-knowledge payment processing.", color: '#ec4899' },
                            { icon: Droplets, title: "Laboratory Integration", desc: "Direct synchronization with modern molecular and clinical diagnostic laboratory systems.", color: '#ef4444' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card"
                                style={{
                                    padding: '3rem', borderRadius: '40px', background: 'white',
                                    border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                                    transition: 'all 0.4s ease'
                                }}
                                whileHover={{ y: -10, borderColor: feature.color, boxShadow: `0 30px 60px -20px ${feature.color}15` }}
                            >
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: '24px', background: 'var(--bg-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: feature.color, border: '1px solid var(--border-subtle)',
                                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
                                }}>
                                    <feature.icon size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', lineHeight: '1.6', fontWeight: 500 }}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact CTA Section */}
            <section style={{ padding: '6rem 0 10rem' }}>
                <div className="container">
                    <motion.div
                        whileInView={{ scale: [0.98, 1], rotateX: [2, 0] }}
                        style={{
                            padding: '8rem 3rem', borderRadius: '60px',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                            textAlign: 'center', position: 'relative', overflow: 'hidden',
                            boxShadow: '0 80px 160px -40px rgba(15, 23, 42, 0.5)',
                            perspective: '1000px'
                        }}
                    >
                        {/* Decorative Geometry */}
                        <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '600px', height: '600px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--primary)', opacity: 0.15, filter: 'blur(100px)' }} />

                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                style={{ display: 'inline-flex', padding: '0.5rem 1.5rem', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2rem' }}
                            >
                                Limited Beta Access
                            </motion.div>
                            <h2 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white', marginBottom: '2rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-3px', lineHeight: 0.95 }}>
                                The Future of Care <br /> is <span className="text-gradient">Now Live</span>.
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 4rem', fontWeight: 500, lineHeight: 1.5 }}>
                                Join 125,000+ elite medical nodes worldwide and revolutionize your healthcare experience today.
                            </p>
                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
                                <Link to="/checkup" style={{ textDecoration: 'none' }}>
                                    <motion.button
                                        whileHover={{ y: -6, scale: 1.05, boxShadow: '0 30px 60px -15px var(--primary-glow)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary"
                                        style={{ padding: '1.5rem 4rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem' }}
                                    >
                                        Initialize Checkup <ChevronRight size={24} />
                                    </motion.button>
                                </Link>
                                {!user && (
                                    <Link to="/register" style={{ textDecoration: 'none' }}>
                                        <motion.button
                                            whileHover={{ y: -6, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.3)' }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                padding: '1.5rem 4rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900,
                                                background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)',
                                                transition: 'all 0.3s ease', cursor: 'pointer'
                                            }}
                                        >
                                            Provider Portal
                                        </motion.button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
