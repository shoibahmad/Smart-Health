import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Calendar, FileText, Settings, Plus, Trash2, Award,
    DollarSign, Clock, MapPin, Briefcase, GraduationCap, X, Save, RefreshCw
} from 'lucide-react';

import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [profileForm, setProfileForm] = useState({
        specialization: '', experience_years: 0, price_per_hour: 0,
        bio: '', location: '', city: '', available_days: []
    });
    const [newService, setNewService] = useState({ name: '', description: '', price: 0, duration_minutes: 30 });
    const [newCertificate, setNewCertificate] = useState({ name: '', issuing_body: '', year: 2024 });
    const [newDegree, setNewDegree] = useState({ degree: '', institution: '', year: 2020, specialization: '' });
    const [showAddService, setShowAddService] = useState(false);
    const [showAddCert, setShowAddCert] = useState(false);
    const [showAddDegree, setShowAddDegree] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'doctor') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Profile
            const userDoc = await getDoc(doc(db, "users", user.uid || user.id));
            let profileData = {};
            if (userDoc.exists()) {
                const userData = userDoc.data();
                profileData = userData.profile || {};
                setProfile(profileData);
                setProfileForm({
                    specialization: profileData.specialization || '',
                    experience_years: profileData.experience_years || 0,
                    price_per_hour: profileData.price_per_hour || 0,
                    bio: profileData.bio || '',
                    location: profileData.location || '',
                    city: profileData.city || '',
                    available_days: profileData.available_days || []
                });
            }

            // Appointments
            const q = query(collection(db, "appointments"), where("doctor_id", "==", user.uid || user.id));
            const aptSnapshot = await getDocs(q);
            const aptList = aptSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAppointments(aptList);

            // Patients (unique patients from appointments)
            const uniquePatients = {};
            aptList.forEach(apt => {
                if (apt.patient_id && !uniquePatients[apt.patient_id]) {
                    uniquePatients[apt.patient_id] = { id: apt.patient_id, full_name: apt.patient_name, email: apt.patient_email || 'N/A' };
                }
            });
            setPatients(Object.values(uniquePatients));

        } catch (error) {
            console.error("Failed to fetch data", error);
        }
        setLoading(false);
    };

    const updateProfile = async () => {
        try {
            const userRef = doc(db, "users", user.uid || user.id);
            await updateDoc(userRef, { profile: { ...profile, ...profileForm } });
            fetchData();
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const addService = async () => {
        try {
            const newServices = [...(profile?.services || []), newService];
            await updateDoc(doc(db, "users", user.uid || user.id), { "profile.services": newServices });
            fetchData();
            setNewService({ name: '', description: '', price: 0, duration_minutes: 30 });
            setShowAddService(false);
        } catch (error) {
            console.error("Failed to add service", error);
        }
    };

    const removeService = async (serviceName) => {
        try {
            const newServices = (profile?.services || []).filter(s => s.name !== serviceName);
            await updateDoc(doc(db, "users", user.uid || user.id), { "profile.services": newServices });
            fetchData();
        } catch (error) {
            console.error("Failed to remove service", error);
        }
    };

    const addCertificate = async () => {
        try {
            const newCerts = [...(profile?.certificates || []), newCertificate];
            await updateDoc(doc(db, "users", user.uid || user.id), { "profile.certificates": newCerts });
            fetchData();
            setNewCertificate({ name: '', issuing_body: '', year: 2024 });
            setShowAddCert(false);
        } catch (error) {
            console.error("Failed to add certificate", error);
        }
    };

    const addDegree = async () => {
        try {
            const newDegrees = [...(profile?.degrees || []), newDegree];
            await updateDoc(doc(db, "users", user.uid || user.id), { "profile.degrees": newDegrees });
            fetchData();
            setNewDegree({ degree: '', institution: '', year: 2020, specialization: '' });
            setShowAddDegree(false);
        } catch (error) {
            console.error("Failed to add degree", error);
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: Settings },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'credentials', label: 'Credentials', icon: GraduationCap },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
    ];

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (loading) {
        return (
            <div style={{ paddingTop: '120px', textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <RefreshCw size={40} style={{ color: '#8b5cf6' }} />
                </motion.div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '100px', padding: '100px 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 700, color: 'white'
                    }}>
                        {user?.full_name?.charAt(0)}
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Doctor Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Welcome, Dr. {user?.full_name}</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchData}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)' }}
                >
                    <RefreshCw size={18} /> Refresh
                </motion.button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '12px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.7rem 1.25rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: activeTab === tab.id ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'transparent',
                            border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem',
                            boxShadow: activeTab === tab.id ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                    >
                        <tab.icon size={18} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={24} style={{ color: '#10b981' }} /> Profile Settings
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Specialization</label>
                            <input
                                type="text"
                                placeholder="e.g., Cardiology, Neurology"
                                value={profileForm.specialization}
                                onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Experience (Years)</label>
                            <input
                                type="number"
                                value={profileForm.experience_years}
                                onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Price per Hour ($)</label>
                            <input
                                type="number"
                                value={profileForm.price_per_hour}
                                onChange={(e) => setProfileForm({ ...profileForm, price_per_hour: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>City</label>
                            <input
                                type="text"
                                placeholder="e.g., New York"
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Location / Address</label>
                            <input
                                type="text"
                                placeholder="Full clinic address"
                                value={profileForm.location}
                                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bio</label>
                            <textarea
                                rows={3}
                                placeholder="Brief description about yourself..."
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Available Days</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => {
                                            const days = profileForm.available_days.includes(day)
                                                ? profileForm.available_days.filter(d => d !== day)
                                                : [...profileForm.available_days, day];
                                            setProfileForm({ ...profileForm, available_days: days });
                                        }}
                                        style={{
                                            padding: '0.5rem 1rem', borderRadius: '8px',
                                            background: profileForm.available_days.includes(day) ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'rgba(255,255,255,0.05)',
                                            border: profileForm.available_days.includes(day) ? 'none' : '1px solid var(--glass-border)',
                                            color: 'white', cursor: 'pointer', fontSize: '0.85rem'
                                        }}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={updateProfile}
                        style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Save size={18} /> Save Profile
                    </motion.button>
                </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Briefcase size={24} style={{ color: '#f59e0b' }} /> My Services
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddService(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}
                        >
                            <Plus size={18} /> Add Service
                        </motion.button>
                    </div>

                    {profile?.services?.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {profile.services.map((service, i) => (
                                <div key={i} style={{
                                    padding: '1.25rem', borderRadius: '12px',
                                    background: 'rgba(245, 158, 11, 0.05)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>{service.name}</h4>
                                        <button
                                            onClick={() => removeService(service.name)}
                                            style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.25rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{service.description || 'No description'}</p>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                                            <DollarSign size={14} /> ${service.price}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                                            <Clock size={14} /> {service.duration_minutes} min
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No services added yet</p>
                    )}

                    {/* Add Service Modal */}
                    <AnimatePresence>
                        {showAddService && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0 }}>Add New Service</h3>
                                        <button onClick={() => setShowAddService(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <input placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                                    <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="number" placeholder="Price ($)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })} />
                                        <input type="number" placeholder="Duration (min)" value={newService.duration_minutes} onChange={(e) => setNewService({ ...newService, duration_minutes: parseInt(e.target.value) || 30 })} />
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addService} style={{ width: '100%', marginTop: '0.5rem' }}>
                                        Add Service
                                    </motion.button>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Credentials Tab */}
            {activeTab === 'credentials' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Degrees Section */}
                    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <GraduationCap size={24} style={{ color: '#8b5cf6' }} /> Degrees
                            </h2>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddDegree(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
                                <Plus size={18} /> Add Degree
                            </motion.button>
                        </div>
                        {profile?.degrees?.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {profile.degrees.map((deg, i) => (
                                    <div key={i} style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{deg.degree}</h4>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                                            {deg.institution} • {deg.year} {deg.specialization && `• ${deg.specialization}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ color: 'var(--text-muted)' }}>No degrees added</p>}
                    </div>

                    {/* Certificates Section */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={24} style={{ color: '#10b981' }} /> Certificates
                            </h2>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddCert(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
                                <Plus size={18} /> Add Certificate
                            </motion.button>
                        </div>
                        {profile?.certificates?.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {profile.certificates.map((cert, i) => (
                                    <div key={i} style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{cert.name}</h4>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{cert.issuing_body} • {cert.year}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ color: 'var(--text-muted)' }}>No certificates added</p>}
                    </div>

                    {/* Add Degree Modal */}
                    <AnimatePresence>
                        {showAddDegree && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0 }}>Add Degree</h3>
                                        <button onClick={() => setShowAddDegree(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                                    </div>
                                    <input placeholder="Degree (e.g., MBBS, MD)" value={newDegree.degree} onChange={(e) => setNewDegree({ ...newDegree, degree: e.target.value })} />
                                    <input placeholder="Institution" value={newDegree.institution} onChange={(e) => setNewDegree({ ...newDegree, institution: e.target.value })} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="number" placeholder="Year" value={newDegree.year} onChange={(e) => setNewDegree({ ...newDegree, year: parseInt(e.target.value) || 2020 })} />
                                        <input placeholder="Specialization" value={newDegree.specialization} onChange={(e) => setNewDegree({ ...newDegree, specialization: e.target.value })} />
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addDegree} style={{ width: '100%', marginTop: '0.5rem' }}>Add Degree</motion.button>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Add Certificate Modal */}
                    <AnimatePresence>
                        {showAddCert && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0 }}>Add Certificate</h3>
                                        <button onClick={() => setShowAddCert(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                                    </div>
                                    <input placeholder="Certificate Name" value={newCertificate.name} onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })} />
                                    <input placeholder="Issuing Body" value={newCertificate.issuing_body} onChange={(e) => setNewCertificate({ ...newCertificate, issuing_body: e.target.value })} />
                                    <input type="number" placeholder="Year" value={newCertificate.year} onChange={(e) => setNewCertificate({ ...newCertificate, year: parseInt(e.target.value) || 2024 })} />
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addCertificate} style={{ width: '100%', marginTop: '0.5rem' }}>Add Certificate</motion.button>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem' }}>My Patients ({patients.length})</h2>
                    {patients.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map(patient => (
                                        <tr key={patient.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem' }}>{patient.full_name}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{patient.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No patients yet</p>
                    )}
                </motion.div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem' }}>My Appointments ({appointments.length})</h2>
                    {appointments.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {appointments.map(apt => (
                                <div key={apt.id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ marginBottom: '0.5rem' }}>{apt.patient_name}</h3>
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📋 {apt.department} • 📅 {apt.date} at {apt.time}</p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>💊 {apt.symptoms || 'No symptoms specified'}</p>
                                        </div>
                                        <span style={{
                                            padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem',
                                            background: apt.status === 'scheduled' ? 'rgba(96, 165, 250, 0.2)' : apt.status === 'completed' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                                            color: apt.status === 'scheduled' ? '#60a5fa' : apt.status === 'completed' ? '#34d399' : '#f87171',
                                            textTransform: 'capitalize'
                                        }}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No appointments yet</p>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default DoctorDashboard;
