import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Calendar, FileText, Settings, Plus, Trash2, Award,
    DollarSign, Clock, Briefcase, GraduationCap, X, Save, RefreshCw, Activity,
    Pill, Edit3, Send, CheckSquare, BarChart2
} from 'lucide-react';
import UpdateProfileName from '../components/UpdateProfileName';
import AlertModal from '../components/AlertModal';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
    getAppointments, updateAppointmentStatus, updateScheduleSettings,
    createPrescription, getPrescriptions,
    createNote, getNotes,
    createReferral, getReferrals,
    bulkUpdateAppointmentStatus, getDoctorPerformance,
    summarizeNotesGemini
} from '../services/api';
import { DEPARTMENTS } from '../utils/departments';

const TREATMENT_TEMPLATES = {
    'Common Cold': {
        diagnosis: 'Common Cold',
        medications: [
            { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '3 days' },
            { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5 days' }
        ]
    },
    'Hypertension': {
        diagnosis: 'Essential Hypertension',
        medications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }]
    },
    'Type 2 Diabetes': {
        diagnosis: 'Type 2 Diabetes Mellitus',
        medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }]
    },
    'Anxiety/Stress': {
        diagnosis: 'Generalized Anxiety / Stress',
        medications: [{ name: 'Sertraline', dosage: '50mg', frequency: 'Once daily', duration: '30 days' }]
    },
};

const DoctorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('queue');
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [notes, setNotes] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [patients, setPatients] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Profile & Schedule Forms
    const [profileForm, setProfileForm] = useState({ specialization: '', experience_years: 0, price_per_hour: 0, bio: '', location: '', city: '', available_days: [] });
    const [scheduleForm, setScheduleForm] = useState({ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], start_time: '09:00', end_time: '17:00' });
    const [newService, setNewService] = useState({ name: '', description: '', price: 0, duration_minutes: 30 });
    const [showAddService, setShowAddService] = useState(false);
    const [newCertificate, setNewCertificate] = useState({ name: '', issuing_body: '', year: 2024 });
    const [showAddCert, setShowAddCert] = useState(false);
    const [newDegree, setNewDegree] = useState({ degree: '', institution: '', year: 2020, specialization: '' });
    const [showAddDegree, setShowAddDegree] = useState(false);

    // New Modals/Forms State
    const [selectedAptIds, setSelectedAptIds] = useState([]);

    // Prescription Form
    const [showRxModal, setShowRxModal] = useState(false);
    const [rxForm, setRxForm] = useState({
        appointment_id: '', patient_id: '', patient_name: '', patient_email: '', doctor_name: '',
        diagnosis: '', notes: '', template_used: '', medications: []
    });
    const [activeDeptToRefer, setActiveDeptToRefer] = useState('');

    // Referral Form
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [referralForm, setReferralForm] = useState({
        appointment_id: '', patient_id: '', patient_name: '', patient_email: '',
        referred_to_department: '', referred_to_doctor: '', reason: '', notes: ''
    });

    // Notes Form
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteForm, setNoteForm] = useState({
        appointment_id: '', patient_id: '', patient_name: '', note: ''
    });
    const [noteLoading, setNoteLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

    useEffect(() => {
        if (!user || user.role !== 'doctor') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Profile
            const userDoc = await getDoc(doc(db, "users", user.uid || user.id));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setProfile(userData.profile || {});
                setProfileForm({
                    specialization: userData.profile?.specialization || '',
                    experience_years: userData.profile?.experience_years || 0,
                    price_per_hour: userData.profile?.price_per_hour || 0,
                    bio: userData.profile?.bio || '', location: userData.profile?.location || '', city: userData.profile?.city || '',
                    available_days: userData.profile?.available_days || []
                });
                if (userData.schedule_settings) setScheduleForm(userData.schedule_settings);
            }

            // Fetch APIs
            const [aptList, rxList, noteList, refList, perfList] = await Promise.all([
                getAppointments(),
                getPrescriptions(),
                getNotes(),
                getReferrals(),
                getDoctorPerformance().catch(() => [])
            ]);

            console.log("DEBUG: Doctor appointments fetched:", aptList);
            setAppointments(aptList);
            setPrescriptions(rxList);
            setNotes(noteList);
            setReferrals(refList);

            if (perfList.length > 0) {
                // Find this doctor's performance
                const myPerf = perfList.find(p => p.doctor_email === user.email);
                setPerformance(myPerf);
            }

            // Derive unique patients
            const uniquePatients = {};
            aptList.forEach(apt => {
                const pId = apt.patient_email;
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

    // Profile & Credentials Logic
    const updateProfile = async () => {
        await updateDoc(doc(db, "users", user.uid || user.id), { profile: { ...profile, ...profileForm } });
        fetchData();
    };
    const saveSchedule = async () => {
        await updateScheduleSettings(user.uid || user.id, scheduleForm);
        setAlertConfig({
            isOpen: true,
            title: "Schedule Saved",
            message: "Your consulting hours have been successfully updated.",
            type: "success"
        });
        fetchData();
    };
    const addService = async () => { /* Add logic */ await updateDoc(doc(db, "users", user.uid || user.id), { "profile.services": [...(profile?.services || []), newService] }); setShowAddService(false); fetchData(); };
    const removeService = async (name) => { /* remove logic */ await updateDoc(doc(db, "users", user.uid || user.id), { "profile.services": (profile?.services || []).filter(s => s.name !== name) }); fetchData(); };
    const addDegree = async () => { /* add degree */ await updateDoc(doc(db, "users", user.uid || user.id), { "profile.degrees": [...(profile?.degrees || []), newDegree] }); setShowAddDegree(false); fetchData(); };
    const addCertificate = async () => { /* add cert */ await updateDoc(doc(db, "users", user.uid || user.id), { "profile.certificates": [...(profile?.certificates || []), newCertificate] }); setShowAddCert(false); fetchData(); };


    // Queue Logic
    const todayStr = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter(a => a.date === todayStr);
    const futureApts = appointments.filter(a => a.date > todayStr);

    const getPriorityScore = (priority, severity = 0) => {
        let base = severity; // 0-10 from ML
        if (priority === 'Critical') base += 10;
        else if (priority === 'High') base += 5;
        else if (priority === 'Medium') base += 2;
        return base;
    };

    const sortApts = (list) => [...list].sort((a, b) => {
        const pDiff = getPriorityScore(b.triage_priority, b.severity_score) - getPriorityScore(a.triage_priority, a.severity_score);
        if (pDiff !== 0) return pDiff;
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });

    const waitingList = sortApts(todayApts.filter(a => a.status === 'scheduled'));
    const inProgressList = sortApts(todayApts.filter(a => a.status === 'in_progress'));
    const completedList = sortApts(todayApts.filter(a => a.status === 'completed'));
    const upcomingList = sortApts(futureApts.filter(a => a.status === 'scheduled'));

    const handleStatusUpdate = async (aptId, newStatus) => {
        await updateAppointmentStatus(aptId, newStatus);
        fetchData();
    };

    const handleBulkUpdate = async (newStatus) => {
        if (!selectedAptIds.length) return;
        setAlertConfig({
            isOpen: true,
            title: "Bulk Update",
            message: `Are you sure you want to mark ${selectedAptIds.length} appointments as ${newStatus}?`,
            type: "confirm",
            confirmText: "Update All",
            onConfirm: async () => {
                await bulkUpdateAppointmentStatus(selectedAptIds, newStatus);
                setSelectedAptIds([]);
                fetchData();
            }
        });
    };

    // Submissions
    const handleIssuePrescription = async (e) => {
        e.preventDefault();
        if (!rxForm.diagnosis || !rxForm.medications.length) {
            setAlertConfig({
                isOpen: true,
                title: "Incomplete Prescription",
                message: "Diagnosis and at least one medication are required to issue a prescription.",
                type: "warning"
            });
            return;
        }
        await createPrescription(rxForm);
        setShowRxModal(false);
        setAlertConfig({
            isOpen: true,
            title: "Prescription Issued",
            message: "The digital prescription has been successfully sent to the patient.",
            type: "success"
        });
        fetchData();
    };

    const applyRxTemplate = (templateName) => {
        const t = TREATMENT_TEMPLATES[templateName];
        if (t) {
            setRxForm(prev => ({ ...prev, diagnosis: t.diagnosis, medications: [...t.medications], template_used: templateName }));
        }
    };

    const submitNote = async () => {
        if (!noteForm.note) return;
        await createNote(noteForm);
        setShowNoteModal(false);
        fetchData();
    };

    const handleSummarizeNote = async () => {
        if (!noteForm.note.trim()) return;
        setNoteLoading(true);
        try {
            const res = await summarizeNotesGemini(noteForm.note);
            setNoteForm(prev => ({ ...prev, note: res.summary }));
        } catch (err) {
            setAlertConfig({
                isOpen: true,
                title: "AI Analysis Error",
                message: "We encountered an error while summarizing the notes. Please try again.",
                type: "danger"
            });
        }
        setNoteLoading(false);
    };

    const handleSendReferral = async (e) => {
        e.preventDefault();
        if (!referralForm.referred_to_department || !referralForm.reason) {
            setAlertConfig({
                isOpen: true,
                title: "Incomplete Referral",
                message: "Department and reason are required to send a referral.",
                type: "warning"
            });
            return;
        }
        await createReferral(referralForm);
        setShowReferralModal(false);
        setAlertConfig({
            isOpen: true,
            title: "Referral Sent",
            message: "The referral has been successfully recorded and sent.",
            type: "success"
        });
        fetchData();
    };

    const openRxModal = (apt) => {
        setRxForm({
            appointment_id: apt.id, patient_id: apt.patient_email, patient_name: apt.patient_name,
            patient_email: apt.patient_email, doctor_name: apt.doctor_name, diagnosis: '', notes: '', template_used: '', medications: []
        });
        setShowRxModal(true);
    };

    const openNoteModal = (apt) => {
        setNoteForm({ appointment_id: apt.id, patient_id: apt.patient_email, patient_name: apt.patient_name, note: '' });
        setShowNoteModal(true);
    };

    const openReferralModal = (apt) => {
        setReferralForm({
            appointment_id: apt.id, patient_id: apt.patient_email, patient_name: apt.patient_name,
            patient_email: apt.patient_email, referred_to_department: '', referred_to_doctor: '', reason: '', notes: ''
        });
        setShowReferralModal(true);
    };

    const tabs = [
        { id: 'queue', label: 'Triage Queue', icon: Activity },
        { id: 'appointments', label: 'All Appointments', icon: Calendar },
        { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
        { id: 'notes', label: 'Patient Notes', icon: Edit3 },
        { id: 'referrals', label: 'Referrals', icon: Send },
        { id: 'performance', label: 'Performance', icon: BarChart2 },
        { id: 'profile', label: 'My Profile', icon: Settings },
        { id: 'schedule', label: 'Schedule Settings', icon: Clock },
    ];

    const inputStyle = {
        background: 'var(--card-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)',
        padding: '0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.9rem'
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><RefreshCw size={32} style={{ color: 'var(--primary)', opacity: 0.6 }} /></motion.div>
        </div>
    );

    const renderPatientCard = (apt, isQueue = true) => (
        <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{
                padding: '1rem',
                marginBottom: '0.75rem',
                display: 'flex',
                gap: '1rem',
                border: '1px solid var(--border-subtle)',
                background: 'white',
                borderRadius: '16px',
            }}
        >
            {!isQueue && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        checked={selectedAptIds.includes(apt.id)}
                        onChange={e => {
                            if (e.target.checked) setSelectedAptIds([...selectedAptIds, apt.id]);
                            else setSelectedAptIds(selectedAptIds.filter(id => id !== apt.id));
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                </div>
            )}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div>
                        <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}>{apt.patient_name}</h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>
                            {apt.patient_email}
                        </div>
                    </div>
                    {apt.triage_priority && (
                        <span style={{
                            fontSize: '0.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase',
                            ...({
                                'Critical': { background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2' },
                                'High': { background: '#fff7ed', color: '#f97316', border: '1px solid #ffedd5' },
                                'Medium': { background: '#fffbeb', color: '#f59e0b', border: '1px solid #fef3c7' },
                                'Low': { background: '#f0fdf4', color: '#10b981', border: '1px solid #dcfce7' }
                            }[apt.triage_priority] || { background: 'var(--bg-color)', color: 'var(--text-soft)', border: '1px solid var(--border-subtle)' })
                        }}>
                            {apt.triage_priority}
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        <Calendar size={12} style={{ color: 'var(--primary)' }} /> {apt.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        <Clock size={12} style={{ color: 'var(--primary)' }} /> {apt.time}
                    </div>
                </div>

                {apt.symptoms && (
                    <div style={{ fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.03)', borderRadius: '10px', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        {apt.symptoms.substring(0, 100)}{apt.symptoms.length > 100 ? '...' : ''}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isQueue && apt.status === 'scheduled' && (
                        <button onClick={() => handleStatusUpdate(apt.id, 'in_progress')} className="btn-primary" style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>Start Session</button>
                    )}
                    {isQueue && apt.status === 'in_progress' && (
                        <>
                            <button onClick={() => openNoteModal(apt)} style={{ flex: 1, padding: '0.4rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>Note</button>
                            <button onClick={() => openRxModal(apt)} style={{ flex: 1, padding: '0.4rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>RX</button>
                            <button onClick={() => handleStatusUpdate(apt.id, 'completed')} style={{ flex: 2, padding: '0.4rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>Complete</button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div style={{ padding: '0', minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '72px' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
                {/* Sidebar Navigation */}
                <div style={{ 
                    width: '240px', background: 'white', borderRight: '1px solid var(--border-subtle)', 
                    padding: '1rem', position: 'fixed', top: '72px', bottom: 0, overflowY: 'auto'
                }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px', padding: '0.5rem 0.75rem' }}>
                        Clinical Menu
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id} onClick={() => setActiveTab(tab.id)} 
                                style={{ 
                                    padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', 
                                    background: activeTab === tab.id ? 'var(--primary)' : 'transparent', 
                                    border: 'none', borderRadius: '10px', color: activeTab === tab.id ? 'white' : 'var(--text-main)', 
                                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, transition: '0.2s'
                                }}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, padding: '1.5rem', marginLeft: '240px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{tabs.find(t=>t.id===activeTab).label}</h2>
                            <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 600 }}>Dr. <UpdateProfileName /></p>
                        </div>
                        <button onClick={fetchData} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCw size={14} /> Sync
                        </button>
                    </div>


            {/* TAB: Queue */}
            {activeTab === 'queue' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', alignItems: 'start' }}>
                    <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', background: 'white', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}>
                                <Clock size={16} style={{ color: '#f97316', marginRight: '0.5rem', verticalAlign: 'middle' }} /> 
                                Triage Queue
                            </h3>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f97316', background: '#fff7ed', padding: '2px 8px', borderRadius: '6px' }}>Waiting</span>
                        </div>
                        {waitingList.length > 0 ? waitingList.map(a => renderPatientCard(a, true)) : (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-soft)', fontSize: '0.85rem' }}>Queue empty.</div>
                        )}
                    </div>

                    <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(20, 184, 166, 0.02)', border: '1px solid rgba(20, 184, 166, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, color: '#0f766e', fontSize: '1rem', fontWeight: 800 }}>
                                <Activity size={16} style={{ color: '#0d9488', marginRight: '0.5rem', verticalAlign: 'middle' }} /> 
                                Active Sessions
                            </h3>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0d9488', background: '#f0fdfa', padding: '2px 8px', borderRadius: '6px' }}>Live</span>
                        </div>
                        {inProgressList.length > 0 ? inProgressList.map(a => renderPatientCard(a, true)) : (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#0f766e', opacity: 0.6, fontSize: '0.85rem' }}>No live sessions.</div>
                        )}
                    </div>

                    {upcomingList.length > 0 && (
                        <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '1.5rem', borderRadius: '20px', background: 'white', border: '1px solid var(--border-subtle)' }}>
                            <h3 style={{ margin: '0 0 1.25rem', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 900 }}>
                                <Calendar size={18} style={{ color: 'var(--primary)', marginRight: '0.5rem', verticalAlign: 'middle' }} /> Upcoming
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                {upcomingList.map(a => renderPatientCard(a, true))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* TAB: Appointments (Bulk) */}
            {activeTab === 'appointments' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, color: 'var(--text-main)' }}>All Appointments</h2>
                        {selectedAptIds.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleBulkUpdate('completed')} style={{ padding: '0.6rem 1rem', background: '#10b981', color: 'var(--text-main)', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckSquare size={16} /> Complete ({selectedAptIds.length})</button>
                                <button onClick={() => handleBulkUpdate('cancelled')} style={{ padding: '0.6rem 1rem', background: '#ef4444', color: 'var(--text-main)', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><X size={16} /> Cancel ({selectedAptIds.length})</button>
                            </div>
                        )}
                    </div>
                    {appointments.length > 0 ? appointments.map(a => renderPatientCard(a, false)) : <p style={{ color: 'var(--text-muted)' }}>No appointments</p>}
                </motion.div>
            )}

            {/* TAB: Prescriptions */}
            {activeTab === 'prescriptions' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '3rem', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.5)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>Prescription Archive</h2>
                            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-soft)', fontWeight: 600 }}>Manage and issue digital medical authorizations.</p>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setRxForm({
                                    appointment_id: 'manual-' + Date.now(), patient_id: '', patient_name: '',
                                    patient_email: '', doctor_name: user?.full_name || 'Dr. Verified', diagnosis: '', notes: '', template_used: '', medications: []
                                });
                                setShowRxModal(true);
                            }}
                            style={{ 
                                padding: '1rem 2rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', 
                                color: 'white', border: 'none', borderRadius: '18px', fontWeight: 900, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 15px 30px -10px var(--primary-glow)' 
                            }}
                        >
                            <Plus size={20} /> Issue New RX
                        </motion.button>
                    </div>

                    {prescriptions.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.5rem' }}>
                            {prescriptions.map(rx => (
                                <div key={rx.id} className="glass-card" style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>{rx.diagnosis}</h4>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '0.25rem', fontWeight: 700 }}>{rx.patient_name}</div>
                                        </div>
                                        <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-color)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)' }}>
                                            {rx.issued_at?.toString().split('T')[0]}
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        {(rx.medications || []).map((m, i) => (
                                            <span key={i} style={{ padding: '0.5rem 1rem', background: 'var(--primary-plus)', color: 'var(--primary)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Pill size={14} /> {m.name} ({m.dosage})
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>View Details</button>
                                        <button style={{ padding: '0.75rem', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Send size={16} style={{ color: 'var(--primary)' }} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.3)', borderRadius: '32px', border: '1px dashed var(--border-medium)' }}>
                            <Pill size={48} style={{ color: 'var(--text-soft)', marginBottom: '1.5rem', opacity: 0.3 }} />
                            <p style={{ color: 'var(--text-soft)', fontWeight: 600, fontSize: '1.1rem' }}>No prescriptions have been issued yet. Start by clicking the 'Issue New RX' button above.</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* TAB: Notes */}
            {activeTab === 'notes' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Patient Notes</h2>
                    {notes.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {notes.map(n => (
                                <div key={n.id} style={{ padding: '1rem', background: '#feffdb', border: '1px solid #eab308', borderRadius: '10px' }}>
                                    <h4 style={{ margin: '0 0 0.2rem', color: '#854d0e' }}>Patient: {n.patient_name}</h4>
                                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#a16207' }}>Date: {n.created_at?.toString().split('T')[0]}</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#713f12' }}>{n.note}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p style={{ color: 'var(--text-muted)' }}>No notes saved yet.</p>}
                </motion.div>
            )}

            {/* TAB: Referrals */}
            {activeTab === 'referrals' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Specialist Referrals Sent</h2>
                    {referrals.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {referrals.map(r => (
                                <div key={r.id} style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                                    <h4 style={{ margin: '0 0 0.5rem' }}>Patient: {r.patient_name} &rarr; Dept: {r.referred_to_department}</h4>
                                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reason: {r.reason}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p style={{ color: 'var(--text-muted)' }}>No referrals sent.</p>}
                </motion.div>
            )}

            {/* TAB: Performance */}
            {activeTab === 'performance' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '3rem', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.5)', border: '1px solid var(--border-subtle)' }}>
                    <h2 style={{ marginBottom: '2.5rem', color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>Clinical Performance Analytics</h2>
                    {performance ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                            <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f0f9ff', color: '#0369a1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Users size={20} />
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Encounters</p>
                                <h2 style={{ margin: '0.5rem 0 0', color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{performance.total_appointments}</h2>
                            </div>
                            <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f0fdf4', color: '#15803d', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Award size={20} />
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Success Rate</p>
                                <h2 style={{ margin: '0.5rem 0 0', color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{performance.completion_rate}%</h2>
                            </div>
                            <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '40px', height: '40px', background: '#fff1f2', color: '#be123c', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Clock size={20} />
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Efficiency Index</p>
                                <h2 style={{ margin: '0.5rem 0 0', color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{performance.avg_duration_minutes}m</h2>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(255,255,255,0.3)', borderRadius: '24px', border: '1px dashed var(--border-medium)' }}>
                            <p style={{ color: 'var(--text-soft)', fontWeight: 600 }}>Accumulating diagnostic data. Please continue clinical operations.</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Tabs: Profile / Schedule */}
            {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '3rem', borderRadius: '32px', background: 'white', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>Clinical Profile</h2>
                        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-soft)', fontWeight: 600 }}>Update your professional designation and medical bio.</p>
                    </div>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Specialization</label>
                            <select value={profileForm.specialization} onChange={e => setProfileForm({ ...profileForm, specialization: e.target.value })} style={{ ...inputStyle, height: '56px', borderRadius: '16px', fontWeight: 600, appearance: 'auto' }}>
                                <option value="">Select Specialization...</option>
                                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Bio</label>
                            <textarea rows={4} placeholder="Decribe your medical expertise and background..." value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} style={{ ...inputStyle, borderRadius: '16px', fontWeight: 600 }} />
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }}
                            onClick={updateProfile} 
                            style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 20px -5px var(--primary-glow)' }}
                        >
                            UPDATE CLINICAL PROFILE
                        </motion.button>
                    </div>
                </motion.div>
            )}
            {activeTab === 'schedule' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '3rem', borderRadius: '32px', background: 'white', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>Clinical Consulting Schedule</h2>
                        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-soft)', fontWeight: 600 }}>Set your availability and daily consultation timeframes.</p>
                    </div>

                    <div style={{ display: 'grid', gap: '3rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '2px' }}>Operational Days</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                    const isSelected = scheduleForm.days?.includes(day);
                                    return (
                                        <button 
                                            key={day}
                                            onClick={() => {
                                                const newDays = isSelected 
                                                    ? (scheduleForm.days || []).filter(d => d !== day)
                                                    : [...(scheduleForm.days || []), day];
                                                setScheduleForm({ ...scheduleForm, days: newDays });
                                            }}
                                            style={{
                                                padding: '1rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', transition: '0.3s',
                                                background: isSelected ? 'var(--primary)' : 'var(--bg-color)',
                                                color: isSelected ? 'white' : 'var(--text-soft)',
                                                border: '1px solid ' + (isSelected ? 'var(--primary)' : 'var(--border-subtle)'),
                                                boxShadow: isSelected ? '0 10px 20px -5px var(--primary-glow)' : 'none'
                                            }}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '2px' }}>Start Time (A.M.)</label>
                                <input 
                                    type="time" 
                                    value={scheduleForm.start_time} 
                                    onChange={e => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                                    style={{ ...inputStyle, height: '64px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, padding: '0 1.5rem', textAlign: 'center' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '2px' }}>End Time (P.M.)</label>
                                <input 
                                    type="time" 
                                    value={scheduleForm.end_time} 
                                    onChange={e => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                                    style={{ ...inputStyle, height: '64px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, padding: '0 1.5rem', textAlign: 'center' }} 
                                />
                            </div>
                        </div>

                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <motion.button 
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }}
                                onClick={saveSchedule}
                                style={{
                                    width: '100%', height: '68px', borderRadius: '20px', background: 'var(--primary)', color: 'white',
                                    border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer',
                                    boxShadow: '0 20px 40px -10px var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                                }}
                            >
                                <Save size={20} /> SYNC SCHEDULE SETTINGS
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}


            {/* MODALS */}

            {/* Prescription Modal */}
            <AnimatePresence>
                {showRxModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} style={{ background: 'white', padding: '3.5rem', borderRadius: '32px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.2)', border: '1px solid var(--border-medium)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)' }}>Digital Prescription</h3>
                                    <p style={{ margin: '0.5rem 0 0', color: 'var(--text-soft)', fontWeight: 600 }}>Patient: {rxForm.patient_name}</p>
                                </div>
                                <button onClick={() => setShowRxModal(false)} style={{ background: 'var(--bg-color)', border: 'none', cursor: 'pointer', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-soft)' }}><X size={24} /></button>
                            </div>
                            
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Recipient Selection</label>
                                <select 
                                    value={rxForm.patient_email}
                                    onChange={(e) => {
                                        const p = patients.find(p => p.email === e.target.value);
                                        if (p) {
                                            setRxForm({ ...rxForm, patient_id: p.email, patient_name: p.full_name, patient_email: p.email });
                                        }
                                    }}
                                    style={{ ...inputStyle, height: '56px', borderRadius: '16px', fontWeight: 600 }}
                                >
                                    <option value="">Select Registered Patient...</option>
                                    {patients.map(p => <option key={p.email} value={p.email}>{p.full_name} ({p.email})</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Protocols</label>
                                <select onChange={(e) => applyRxTemplate(e.target.value)} style={{ ...inputStyle, height: '56px', borderRadius: '16px', fontWeight: 600 }}>
                                    <option value="">Custom Prescription Protocol</option>
                                    {Object.keys(TREATMENT_TEMPLATES).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Diagnosis</label>
                                <input placeholder="Enter clinical diagnosis..." value={rxForm.diagnosis} onChange={e => setRxForm({ ...rxForm, diagnosis: e.target.value })} style={{ ...inputStyle, height: '56px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem' }} />
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Medication Regimen</label>
                                    <button onClick={() => setRxForm({ ...rxForm, medications: [...rxForm.medications, { name: '', dosage: '', frequency: '', duration: '' }] })} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Compound</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {rxForm.medications.map((m, i) => (
                                        <div key={i} style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <input placeholder="Drug Name" value={m.name} onChange={e => { const meds = [...rxForm.medications]; meds[i].name = e.target.value; setRxForm({ ...rxForm, medications: meds }); }} style={{ ...inputStyle, background: 'white', borderRadius: '12px', fontWeight: 600 }} />
                                                <input placeholder="Dosage" value={m.dosage} onChange={e => { const meds = [...rxForm.medications]; meds[i].dosage = e.target.value; setRxForm({ ...rxForm, medications: meds }); }} style={{ ...inputStyle, background: 'white', borderRadius: '12px', fontWeight: 600 }} />
                                                <input placeholder="Frequency" value={m.frequency} onChange={e => { const meds = [...rxForm.medications]; meds[i].frequency = e.target.value; setRxForm({ ...rxForm, medications: meds }); }} style={{ ...inputStyle, background: 'white', borderRadius: '12px', fontWeight: 600 }} />
                                                <input placeholder="Duration" value={m.duration} onChange={e => { const meds = [...rxForm.medications]; meds[i].duration = e.target.value; setRxForm({ ...rxForm, medications: meds }); }} style={{ ...inputStyle, background: 'white', borderRadius: '12px', fontWeight: 600 }} />
                                            </div>
                                            <button onClick={() => { const meds = [...rxForm.medications]; meds.splice(i, 1); setRxForm({ ...rxForm, medications: meds }); }} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Directives</label>
                                <textarea rows={3} placeholder="Additional instructions for patient or pharmacist..." value={rxForm.notes} onChange={e => setRxForm({ ...rxForm, notes: e.target.value })} style={{ ...inputStyle, borderRadius: '16px', fontWeight: 600 }} />
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }}
                                onClick={handleIssuePrescription} 
                                className="btn-primary"
                                style={{ width: '100%', height: '64px', borderRadius: '20px', fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 20px 40px -10px var(--primary-glow)' }}
                            >
                                AUTHORIZE & TRANSMIT
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Note Modal */}
            <AnimatePresence>
                {showNoteModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', maxWidth: '500px', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Add Private Note</h3>
                                <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                            </div>
                            <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patient: {noteForm.patient_name}</p>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                <button
                                    onClick={handleSummarizeNote}
                                    disabled={noteLoading || !noteForm.note}
                                    style={{
                                        padding: '0.5rem 0.875rem', background: '#f0f9ff', color: '#0284c7',
                                        border: '1px solid #bae6fd', borderRadius: '8px', cursor: noteLoading ? 'wait' : 'pointer',
                                        fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    {noteLoading ? <RefreshCw size={14} className="spin" /> : <Activity size={14} />}
                                    {noteLoading ? 'Summarizing...' : 'Summarize with AI ✨'}
                                </button>
                            </div>

                            <textarea rows={8} placeholder="Write your consultation notes here. Write roughly what happened, then click 'Summarize with AI' to instantly format it professionally!" value={noteForm.note} onChange={e => setNoteForm({ ...noteForm, note: e.target.value })} style={{ ...inputStyle, marginBottom: '1rem', height: 'auto' }} />
                            <button onClick={submitNote} disabled={noteLoading} style={{ width: '100%', padding: '0.875rem', background: 'var(--primary)', color: 'var(--text-main)', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: noteLoading ? 'wait' : 'pointer' }}>Save Note</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Referral Modal */}
            <AnimatePresence>
                {showReferralModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', maxWidth: '500px', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Refer Patient to Specialist</h3>
                                <button onClick={() => setShowReferralModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                            </div>
                            <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patient: {referralForm.patient_name}</p>
                            <select value={referralForm.referred_to_department} onChange={e => setReferralForm({ ...referralForm, referred_to_department: e.target.value })} style={{ ...inputStyle, marginBottom: '1rem', appearance: 'auto' }}>
                                <option value="">Select Department to refer to...</option>
                                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                            <textarea rows={3} placeholder="Reason for referral..." value={referralForm.reason} onChange={e => setReferralForm({ ...referralForm, reason: e.target.value })} style={{ ...inputStyle, marginBottom: '1rem' }} />
                            <button onClick={handleSendReferral} style={{ width: '100%', padding: '0.875rem', background: 'var(--primary)', color: 'var(--text-main)', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Send Referral</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

                    <AlertModal 
                        isOpen={alertConfig.isOpen}
                        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                        onConfirm={alertConfig.onConfirm}
                        title={alertConfig.title}
                        message={alertConfig.message}
                        type={alertConfig.type}
                        confirmText={alertConfig.confirmText}
                    />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
