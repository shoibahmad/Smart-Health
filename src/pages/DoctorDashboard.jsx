import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Calendar, FileText, Settings, Plus, Trash2, Award,
    DollarSign, Clock, MapPin, Briefcase, GraduationCap, X, Save, RefreshCw, Activity,
    Target, CheckCircle, Shield, Mail, Phone, Video
} from 'lucide-react';
import UpdateProfileName from '../components/UpdateProfileName';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAppointments, updateAppointmentStatus, updateScheduleSettings } from '../services/api';

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

    // Schedule form states
    const [scheduleForm, setScheduleForm] = useState({
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '09:00',
        end_time: '17:00'
    });
    const [savingSchedule, setSavingSchedule] = useState(false);

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
                if (userData.schedule_settings) {
                    setScheduleForm(userData.schedule_settings);
                }
            }

            // Appointments
            const aptList = await getAppointments();
            setAppointments(aptList);

            // Patients (unique patients from appointments)
            const uniquePatients = {};
            aptList.forEach(apt => {
                const pId = apt.patient_id || apt.patient_email;
                if (pId && !uniquePatients[pId]) {
                    uniquePatients[pId] = { id: pId, full_name: apt.patient_name, email: apt.patient_email || 'N/A' };
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

    const saveSchedule = async () => {
        setSavingSchedule(true);
        try {
            await updateScheduleSettings(user.uid || user.id, scheduleForm);
            alert("Schedule saved successfully!");
            fetchData();
        } catch (error) {
            console.error("Failed to save schedule", error);
            alert("Failed to save schedule settings.");
        }
        setSavingSchedule(false);
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: Settings },
        { id: 'schedule', label: 'Schedule Settings', icon: Clock },
        { id: 'queue', label: 'Triage Queue', icon: Activity },
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

    // --- Triage Queue Logic ---
    const todayStr = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter(a => a.date === todayStr);

    const getPriorityScore = (priority) => {
        if (priority === 'Critical') return 4;
        if (priority === 'High') return 3;
        if (priority === 'Medium') return 2;
        return 1;
    };

    const sortedToday = todayApts.sort((a, b) => {
        const prioDiff = getPriorityScore(b.triage_priority) - getPriorityScore(a.triage_priority);
        if (prioDiff !== 0) return prioDiff;
        return a.time.localeCompare(b.time);
    });

    const waitingList = sortedToday.filter(a => a.status === 'scheduled');
    const inProgressList = sortedToday.filter(a => a.status === 'in_progress');
    const completedList = sortedToday.filter(a => a.status === 'completed');

    const handleStatusUpdate = async (aptId, newStatus) => {
        try {
            await updateAppointmentStatus(aptId, newStatus);
            fetchData();
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    const renderPatientCard = (apt) => (
        <div key={apt.id} style={{ padding: '1rem', background: '#ffffff', border: '1px solid var(--glass-border)', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem' }}>{apt.patient_name}</h4>
                {apt.triage_priority && (
                    <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600,
                        ...({
                            'Critical': { background: '#fee2e2', color: 'var(--danger)' },
                            'High': { background: '#ffedd5', color: '#ea580c' },
                            'Medium': { background: '#fef3c7', color: '#d97706' },
                            'Low': { background: '#d1fae5', color: '#059669' }
                        }[apt.triage_priority] || { background: '#f1f5f9', color: '#64748b' })
                    }}>
                        {apt.triage_priority}
                    </span>
                )}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <div style={{ marginBottom: '0.2rem' }}>🕒 {apt.time} ({apt.estimated_duration_minutes || 30}m)</div>
                <div>📋 {apt.department}</div>
            </div>
            {apt.symptoms && (
                <div style={{ fontSize: '0.8rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '6px', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    <strong>Symptoms:</strong> {apt.symptoms}
                </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {apt.status === 'scheduled' && (
                    <button
                        onClick={() => handleStatusUpdate(apt.id, 'in_progress')}
                        style={{ flex: 1, padding: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
                    >
                        Start Consult
                    </button>
                )}
                {apt.status === 'in_progress' && (
                    <button
                        onClick={() => handleStatusUpdate(apt.id, 'completed')}
                        style={{ flex: 1, padding: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
                    >
                        Complete
                    </button>
                )}
                {apt.status === 'completed' && (
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', color: '#10b981', fontWeight: 600, padding: '0.5rem' }}>
                        ✓ Finished
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ paddingTop: '100px', padding: '100px 2rem 4rem', maxWidth: '1200px', margin: '0 auto', background: 'var(--bg-color)', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 700, color: 'white',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        {user?.full_name?.charAt(0)}
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>Doctor Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Welcome, Dr. <UpdateProfileName />
                        </p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchData}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#ffffff', color: 'var(--primary)',
                        border: '1px solid var(--primary)', padding: '0.75rem 1.25rem',
                        borderRadius: '12px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <RefreshCw size={18} /> Refresh
                </motion.button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', background: 'var(--glass-border)', padding: '0.5rem', borderRadius: '12px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.7rem 1.25rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                            border: 'none', borderRadius: '8px',
                            color: activeTab === tab.id ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem',
                            fontWeight: 600,
                            boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none'
                        }}
                    >
                        <tab.icon size={18} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Triage Queue Tab */}
            {activeTab === 'queue' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

                    {/* Waiting Column */}
                    <div className="card" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={20} style={{ color: '#ea580c' }} /> Waiting
                            </h3>
                            <span style={{ background: '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{waitingList.length}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {waitingList.length > 0 ? waitingList.map(renderPatientCard) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No patients waiting</p>}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="card" style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={20} style={{ color: '#16a34a' }} /> In Progress
                            </h3>
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>{inProgressList.length}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {inProgressList.length > 0 ? inProgressList.map(renderPatientCard) : <p style={{ color: '#166534', opacity: 0.7, textAlign: 'center', fontSize: '0.9rem' }}>No active consults</p>}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="card" style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={20} style={{ color: 'var(--primary)' }} /> Completed
                            </h3>
                            <span style={{ background: '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{completedList.length}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {completedList.length > 0 ? completedList.map(renderPatientCard) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>None yet today</p>}
                        </div>
                    </div>

                </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                        <Settings size={24} style={{ color: 'var(--primary)' }} /> Profile Settings
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Specialization</label>
                            <input
                                type="text"
                                placeholder="e.g., Cardiology, Neurology"
                                value={profileForm.specialization}
                                onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                                style={{ background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Experience (Years)</label>
                            <input
                                type="number"
                                value={profileForm.experience_years}
                                onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseInt(e.target.value) || 0 })}
                                style={{ background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Price per Hour ($)</label>
                            <input
                                type="number"
                                value={profileForm.price_per_hour}
                                onChange={(e) => setProfileForm({ ...profileForm, price_per_hour: parseFloat(e.target.value) || 0 })}
                                style={{ background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>City</label>
                            <input
                                type="text"
                                placeholder="e.g., New York"
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                style={{ background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Location / Address</label>
                            <input
                                type="text"
                                placeholder="Full clinic address"
                                value={profileForm.location}
                                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                style={{ background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Bio</label>
                            <textarea
                                rows={3}
                                placeholder="Brief description about yourself..."
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                style={{ resize: 'vertical', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Available Days</label>
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
                                            background: profileForm.available_days.includes(day) ? 'var(--primary)' : '#f1f3f4',
                                            border: '1px solid var(--glass-border)',
                                            color: profileForm.available_days.includes(day) ? 'white' : 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem'
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
                        style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.875rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
                    >
                        <Save size={18} /> Save Profile
                    </motion.button>
                </motion.div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                        <Clock size={24} style={{ color: 'var(--primary)' }} /> Set Working Hours
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Shift Start Time</label>
                            <input
                                type="time"
                                value={scheduleForm.start_time}
                                onChange={(e) => setScheduleForm(prev => ({ ...prev, start_time: e.target.value }))}
                                style={{ background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Shift End Time</label>
                            <input
                                type="time"
                                value={scheduleForm.end_time}
                                onChange={(e) => setScheduleForm(prev => ({ ...prev, end_time: e.target.value }))}
                                style={{ background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', width: '100%', fontSize: '1rem' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Working Days</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => {
                                            const newDays = scheduleForm.days.includes(day)
                                                ? scheduleForm.days.filter(d => d !== day)
                                                : [...scheduleForm.days, day];
                                            setScheduleForm(prev => ({ ...prev, days: newDays }));
                                        }}
                                        style={{
                                            padding: '0.6rem 1.25rem', borderRadius: '8px',
                                            background: scheduleForm.days.includes(day) ? 'var(--primary)' : '#f8f9fa',
                                            border: scheduleForm.days.includes(day) ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                            color: scheduleForm.days.includes(day) ? 'white' : 'var(--text-main)',
                                            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveSchedule}
                        disabled={savingSchedule}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: savingSchedule ? '#a78bfa' : 'var(--primary)', color: 'white', border: 'none', padding: '0.875rem 1.5rem', borderRadius: '10px', cursor: savingSchedule ? 'wait' : 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
                    >
                        <Save size={18} /> {savingSchedule ? 'Saving...' : 'Save Schedule'}
                    </motion.button>
                </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                            <Briefcase size={24} style={{ color: 'var(--primary)' }} /> My Services
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddService(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
                        >
                            <Plus size={18} /> Add Service
                        </motion.button>
                    </div>

                    {profile?.services?.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {profile.services.map((service, i) => (
                                <div key={i} style={{
                                    padding: '1.25rem', borderRadius: '12px',
                                    background: '#ffffff',
                                    border: '1px solid var(--glass-border)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{service.name}</h4>
                                        <button
                                            onClick={() => removeService(service.name)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{service.description || 'No description'}</p>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>
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
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '450px', width: '100%', padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Add New Service</h3>
                                        <button onClick={() => setShowAddService(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <input placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                                    <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="number" placeholder="Price ($)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })} style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                                        <input type="number" placeholder="Duration (min)" value={newService.duration_minutes} onChange={(e) => setNewService({ ...newService, duration_minutes: parseInt(e.target.value) || 30 })} style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addService} style={{ width: '100%', marginTop: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
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
                    <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                                <GraduationCap size={24} style={{ color: 'var(--primary)' }} /> Degrees
                            </h2>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddDegree(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                                <Plus size={18} /> Add Degree
                            </motion.button>
                        </div>
                        {profile?.degrees?.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {profile.degrees.map((deg, i) => (
                                    <div key={i} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{deg.degree}</h4>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                                            {deg.institution} • {deg.year} {deg.specialization && `• ${deg.specialization}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ color: 'var(--text-muted)' }}>No degrees added</p>}
                    </div>

                    {/* Certificates Section */}
                    <div className="card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                                <Award size={24} style={{ color: 'var(--primary)' }} /> Certificates
                            </h2>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddCert(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                                <Plus size={18} /> Add Certificate
                            </motion.button>
                        </div>
                        {profile?.certificates?.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {profile.certificates.map((cert, i) => (
                                    <div key={i} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{cert.name}</h4>
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
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '450px', width: '100%', padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Add Certificate</h3>
                                        <button onClick={() => setShowAddCert(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                                    </div>
                                    <input placeholder="Certificate Name" value={newCertificate.name} onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })} style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                                    <input placeholder="Issuing Body" value={newCertificate.issuing_body} onChange={(e) => setNewCertificate({ ...newCertificate, issuing_body: e.target.value })} style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                                    <input type="number" placeholder="Year" value={newCertificate.year} onChange={(e) => setNewCertificate({ ...newCertificate, year: parseInt(e.target.value) || 2024 })} style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} />
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addCertificate} style={{ width: '100%', marginTop: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>Add Certificate</motion.button>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>My Patients ({patients.length})</h2>
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
                                            <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{patient.full_name}</td>
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>My Appointments ({appointments.length})</h2>
                    {appointments.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {appointments.map(apt => (
                                <div key={apt.id} style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{apt.patient_name}</h3>
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📋 {apt.department} • 📅 {apt.date} at {apt.time}</p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>💊 {apt.symptoms || 'No symptoms specified'}</p>
                                        </div>
                                        <span style={{
                                            padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem',
                                            background: apt.status === 'scheduled' ? 'var(--primary-bg)' : apt.status === 'completed' ? '#d1fae5' : '#fee2e2',
                                            color: apt.status === 'scheduled' ? 'var(--primary)' : apt.status === 'completed' ? '#10b981' : 'var(--danger)',
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
