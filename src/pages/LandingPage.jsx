import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Search, MapPin, Star, Clock, DollarSign, ArrowRight,
    Stethoscope, Heart, Brain, Eye, Bone, Activity, Shield,
    ChevronRight, Users, Award, Calendar, MessageCircle, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [loading, setLoading] = useState(false);

    const specializations = [
        { name: 'Cardiology', icon: Heart, color: '#ef4444' },
        { name: 'Neurology', icon: Brain, color: '#8b5cf6' },
        { name: 'Ophthalmology', icon: Eye, color: '#06b6d4' },
        { name: 'Orthopedics', icon: Bone, color: '#f59e0b' },
        { name: 'General Medicine', icon: Stethoscope, color: '#10b981' },
        { name: 'Dermatology', icon: Activity, color: '#ec4899' },
    ];

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            let q = query(collection(db, "users"), where("role", "==", "doctor"));
            const snapshot = await getDocs(q);
            let docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (searchQuery) {
                docsList = docsList.filter(d =>
                    d.profile?.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            if (searchCity) {
                docsList = docsList.filter(d =>
                    d.profile?.city?.toLowerCase().includes(searchCity.toLowerCase())
                );
            }
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

    const searchBySpecialization = (spec) => {
        setSearchQuery(spec);
        setTimeout(() => fetchDoctors(), 100);
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div style={{ paddingTop: '80px' }}>
            {/* Hero Section with Search */}
            <section style={{
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: '2rem'
            }}>
                {/* Background Blobs */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: '#8b5cf6', filter: 'blur(120px)', opacity: 0.15, zIndex: -1 }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: '#06b6d4', filter: 'blur(120px)', opacity: 0.15, zIndex: -1 }} />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.15 }}
                    style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}
                >
                    <motion.div variants={fadeIn} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1.25rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#a78bfa',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <Shield size={16} /> Trusted by 10,000+ Patients
                    </motion.div>

                    <motion.h1 variants={fadeIn} style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 800,
                        marginBottom: '1.5rem',
                        lineHeight: 1.1
                    }}>
                        Find Your Perfect
                        <span style={{
                            display: 'block',
                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Healthcare Specialist</span>
                    </motion.h1>

                    <motion.p variants={fadeIn} style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-muted)',
                        marginBottom: '2.5rem',
                        maxWidth: '700px',
                        margin: '0 auto 2.5rem'
                    }}>
                        Search top-rated doctors by specialization, view their services, prices, and book appointments instantly.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.form
                        variants={fadeIn}
                        onSubmit={handleSearch}
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}
                    >
                        <div style={{
                            flex: '1 1 280px',
                            position: 'relative'
                        }}>
                            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search specialization..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 48px',
                                    borderRadius: '14px',
                                    marginBottom: 0,
                                    background: 'rgba(30, 41, 59, 0.8)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{
                            flex: '1 1 200px',
                            position: 'relative'
                        }}>
                            <MapPin size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="City..."
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 48px',
                                    borderRadius: '14px',
                                    marginBottom: 0,
                                    background: 'rgba(30, 41, 59, 0.8)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '14px',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                            }}
                        >
                            <Search size={20} /> Search Doctors
                        </motion.button>
                    </motion.form>
                </motion.div>
            </section>

            {/* Quick Specialization Pills */}
            <section style={{ padding: '0 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                    {specializations.map((spec, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => searchBySpecialization(spec.name)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '30px',
                                background: searchQuery === spec.name
                                    ? `linear-gradient(135deg, ${spec.color}, ${spec.color}88)`
                                    : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${searchQuery === spec.name ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                                color: 'white',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                boxShadow: searchQuery === spec.name ? `0 4px 15px ${spec.color}40` : 'none'
                            }}
                        >
                            <spec.icon size={18} style={{ color: searchQuery === spec.name ? 'white' : spec.color }} />
                            {spec.name}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Doctors Grid */}
            <section style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>
                        {searchQuery ? `${searchQuery} Specialists` : 'Featured Doctors'}
                    </h2>
                    <span style={{ color: 'var(--text-muted)' }}>{doctors.length} doctors found</span>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Activity size={40} style={{ color: '#8b5cf6', animation: 'spin 1s linear infinite' }} />
                        <p>Searching doctors...</p>
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3>No doctors found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try a different specialization or city</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {doctors.map((doctor, i) => (
                            <motion.div
                                key={doctor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card"
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                            >
                                {/* Doctor Header */}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {doctor.full_name?.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                                            Dr. {doctor.full_name}
                                        </h3>
                                        <p style={{
                                            margin: 0,
                                            color: '#8b5cf6',
                                            fontSize: '0.9rem',
                                            fontWeight: 500
                                        }}>
                                            {doctor.profile?.specialization || 'General Physician'}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                            <span style={{ fontSize: '0.85rem' }}>
                                                {doctor.profile?.rating || '4.5'}
                                                <span style={{ color: 'var(--text-muted)' }}> ({doctor.profile?.total_reviews || 0} reviews)</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Row */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    padding: '1rem 0',
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {doctor.profile?.experience_years > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Award size={14} style={{ color: '#10b981' }} />
                                            {doctor.profile.experience_years}+ yrs
                                        </div>
                                    )}
                                    {doctor.profile?.city && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <MapPin size={14} style={{ color: '#06b6d4' }} />
                                            {doctor.profile.city}
                                        </div>
                                    )}
                                    {doctor.profile?.price_per_hour > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <DollarSign size={14} style={{ color: '#f59e0b' }} />
                                            ${doctor.profile.price_per_hour}/hr
                                        </div>
                                    )}
                                </div>

                                {/* Services */}
                                {doctor.profile?.services?.length > 0 && (
                                    <div>
                                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Services</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {doctor.profile.services.slice(0, 3).map((service, j) => (
                                                <span key={j} style={{
                                                    padding: '0.3rem 0.6rem',
                                                    background: 'rgba(139, 92, 246, 0.1)',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    color: '#a78bfa'
                                                }}>
                                                    {service.name}
                                                </span>
                                            ))}
                                            {doctor.profile.services.length > 3 && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    +{doctor.profile.services.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            if (!user) {
                                                navigate('/login');
                                                return;
                                            }
                                            const startChat = async () => {
                                                try {
                                                    // Check if conversation exists
                                                    const q = query(collection(db, "conversations"),
                                                        where("doctor_id", "==", doctor.id),
                                                        where("patient_id", "==", user.uid || user.id)
                                                    );
                                                    const snap = await getDocs(q);
                                                    if (!snap.empty) {
                                                        navigate(`/chat/${snap.docs[0].id}`);
                                                        return;
                                                    }

                                                    // Create new
                                                    const docRef = await addDoc(collection(db, "conversations"), {
                                                        doctor_id: doctor.id,
                                                        patient_id: user.uid || user.id,
                                                        doctor_name: doctor.full_name,
                                                        patient_name: user.full_name || 'Patient',
                                                        last_message: '',
                                                        last_message_at: serverTimestamp(),
                                                        unread_count: 0
                                                    });
                                                    navigate(`/chat/${docRef.id}`);
                                                } catch (e) {
                                                    console.error("Error starting chat", e);
                                                }
                                            };
                                            startChat();
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.4rem',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            color: '#10b981',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <MessageCircle size={16} /> Chat
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            border: '1px solid rgba(59, 130, 246, 0.3)',
                                            color: '#60a5fa'
                                        }}
                                    >
                                        <Phone size={16} />
                                    </motion.button>
                                </div>
                                <Link to={`/checkup`} style={{ marginTop: '0.5rem' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <Calendar size={16} /> Book Appointment
                                    </motion.button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Features Section */}
            <section id="services" style={{ padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem' }}>Why Choose Smart Health?</h2>
                    <p style={{ color: 'var(--text-muted)' }}>We combine advanced AI with trusted medical professionals.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: Brain, title: "AI Diagnostics", desc: "Our ML model analyzes your symptoms to recommend the right specialist.", color: '#8b5cf6' },
                        { icon: Calendar, title: "Easy Scheduling", desc: "Book appointments with real-time availability checking.", color: '#06b6d4' },
                        { icon: Shield, title: "Verified Doctors", desc: "All doctors are certified with verified credentials.", color: '#10b981' },
                        { icon: Star, title: "Patient Reviews", desc: "Read authentic reviews from real patients.", color: '#f59e0b' },
                        { icon: DollarSign, title: "Transparent Pricing", desc: "See consultation fees upfront. No hidden charges.", color: '#ec4899' },
                        { icon: Clock, title: "24/7 Support", desc: "Our AI assistant is available round the clock.", color: '#3b82f6' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-card"
                            style={{ padding: '2rem', textAlign: 'left' }}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '14px',
                                background: `${feature.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <feature.icon size={24} style={{ color: feature.color }} />
                            </div>
                            <h3 style={{ marginBottom: '0.75rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '4rem 2rem 6rem', textAlign: 'center' }}>
                <div className="glass-card" style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '4rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Ready to Get Started?</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Describe your symptoms and let our AI find the perfect doctor for you.
                    </p>
                    <Link to="/checkup">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                borderRadius: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Start AI Checkup <ArrowRight size={20} />
                        </motion.button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
