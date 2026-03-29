import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, FileText, CheckCircle, XCircle, Search, Pill, MessageSquare, Briefcase, Download, ClipboardList, Filter, RefreshCw, AlertCircle, Star, Upload, Zap, Activity, FileSearch, Trash2, Settings, User as UserIcon } from 'lucide-react';
import { DEPARTMENTS } from '../utils/departments';
import { db } from '../firebase';
import { 
    getAppointments, getPrescriptions, requestReschedule, leaveReview,
    getVitals, logVitals, summarizeReportPdf, updateUserProfile
} from '../services/api';
import AlertModal from '../components/AlertModal';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import UpdateProfileName from '../components/UpdateProfileName';

const TREATMENT_TEMPLATES = {
    'Common Cold': [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '3 days' }, { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5 days' }],
    'Hypertension': [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }],
    'Diabetes': [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }],
    'Anxiety': [{ name: 'Sertraline', dosage: '50mg', frequency: 'Once daily', duration: '30 days' }],
};

const statusColor = (s) => ({
    scheduled: { 
        bg: 'rgba(99, 102, 241, 0.1)', 
        color: 'var(--primary)',
        border: '1px solid rgba(99, 102, 241, 0.2)'
    },
    completed: { 
        bg: 'rgba(16, 185, 129, 0.1)', 
        color: '#059669',
        border: '1px solid rgba(16, 185, 129, 0.2)'
    },
    cancelled: { 
        bg: 'rgba(239, 68, 68, 0.1)', 
        color: 'var(--danger)',
        border: '1px solid rgba(239, 68, 68, 0.2)'
    },
    in_progress: { 
        bg: 'rgba(245, 158, 11, 0.1)', 
        color: '#d97706',
        border: '1px solid rgba(245, 158, 11, 0.2)'
    },
}[s] || { 
    bg: 'rgba(100, 116, 139, 0.1)', 
    color: '#64748b',
    border: '1px solid rgba(100, 116, 139, 0.2)'
});

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [vitals, setVitals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Vitals Form State
    const [vitalsForm, setVitalsForm] = useState({ weight: '', bp_systolic: '', bp_diastolic: '', glucose: '' });
    const [vitalsLoading, setVitalsLoading] = useState(false);

    // Report Summary State
    const [reportFile, setReportFile] = useState(null);
    const [reportSummary, setReportSummary] = useState('');
    const [reportLoading, setReportLoading] = useState(false);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    // Filters
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Reschedule modal
    const [rescheduleApt, setRescheduleApt] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [rescheduleReason, setRescheduleReason] = useState('');
    const [rescheduleLoading, setRescheduleLoading] = useState(false);
    const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

    // Review State
    const [reviewApt, setReviewApt] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);

    // Prescription modal
    const [viewPrescription, setViewPrescription] = useState(null);

    // Profile Edit State
    const [profileFormData, setProfileFormData] = useState({
        full_name: user?.full_name || '',
        age: user?.age || '',
        gender: user?.gender || '',
        address: user?.address || ''
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    useEffect(() => {
        if (!user || user.role !== 'patient') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [apts, rxs, vitalsData] = await Promise.all([
                getAppointments().catch(() => []),
                getPrescriptions().catch(() => []),
                getVitals().catch(() => []),
            ]);
            apts.sort((a, b) => new Date(`${a.date}T${a.time} `) - new Date(`${b.date}T${b.time} `));
            setAppointments(apts);
            setPrescriptions(rxs);
            setVitals(vitalsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
        setLoading(false);
    };

    const handleReschedule = async () => {
        if (!newDate || !newTime) return;
        setRescheduleLoading(true);
        try {
            await requestReschedule(rescheduleApt.id, newDate, newTime, rescheduleReason);
            setRescheduleSuccess(true);
            setTimeout(() => {
                setRescheduleApt(null);
                setRescheduleSuccess(false);
                setNewDate(''); setNewTime(''); setRescheduleReason('');
                fetchData();
            }, 1800);
        } catch (e) {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to request reschedule: " + e.message,
                type: "danger"
            });
        }
        setRescheduleLoading(false);
    };

    const submitReview = async () => {
        if (!reviewApt || reviewRating < 1) return;
        setReviewLoading(true);
        try {
            await leaveReview(reviewApt.id, { rating: reviewRating, comment: reviewComment });
            setReviewSuccess(true);
            setTimeout(() => {
                setReviewApt(null);
                setReviewSuccess(false);
                setReviewRating(5);
                setReviewComment('');
                fetchData();
            }, 2000);
        } catch (error) {
            console.error("Failed to submit review:", error);
            setAlertConfig({
                isOpen: true,
                title: "Review Error",
                message: "We couldn't submit your review. Please try again.",
                type: "danger"
            });
        }
        setReviewLoading(false);
    };

    const downloadPrescription = (rx) => {
        const content = [
            `SMART HEALTH – DIGITAL PRESCRIPTION`,
            `============================================= `,
            `Patient: ${rx.patient_name} `,
            `Doctor: ${rx.doctor_name} `,
            `Date Issued: ${rx.issued_at || 'N/A'} `,
            `Diagnosis: ${rx.diagnosis} `,
            ``,
            `MEDICATIONS: `,
            ...(rx.medications || []).map((m, i) =>
                `${i + 1}. ${m.name} – ${m.dosage}, ${m.frequency} for ${m.duration}`
            ),
            ``,
            rx.notes ? `Notes: ${rx.notes} ` : '',
            `============================================= `,
            `This is a digitally issued prescription from Smart Health.`,
        ].join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `prescription_${rx.id?.slice(0, 8)}.txt`;
        a.click(); URL.revokeObjectURL(url);
    };

    const handleVitalsSubmit = async (e) => {
        e.preventDefault();
        setVitalsLoading(true);
        try {
            await logVitals({
                weight: parseFloat(vitalsForm.weight),
                bp_systolic: parseInt(vitalsForm.bp_systolic),
                bp_diastolic: parseInt(vitalsForm.bp_diastolic),
                glucose: parseInt(vitalsForm.glucose)
            });
            setVitalsForm({ weight: '', bp_systolic: '', bp_diastolic: '', glucose: '' });
            fetchData();
        } catch (err) {
            setAlertConfig({
                isOpen: true,
                title: "Logging Failed",
                message: "Failed to log vitals: " + err.message,
                type: "danger"
            });
        }
        setVitalsLoading(false);
    };

    const handleReportUpload = async () => {
        if (!reportFile) return;
        setReportLoading(true);
        setReportSummary('');
        try {
            const res = await summarizeReportPdf(reportFile);
            setReportSummary(res.summary);
            fetchData(); // Refresh XP
        } catch (err) {
            setAlertConfig({
                isOpen: true,
                title: "Upload Error",
                message: "Upload failed: " + err.message,
                type: "danger"
            });
        }
        setReportLoading(false);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            await updateUserProfile(user.uid, profileFormData);
            setAlertConfig({
                isOpen: true,
                title: "Profile Updated",
                message: "Your profile details have been successfully updated.",
                type: "success"
            });
            // Reload user data - in a real app, use a context update or refresh
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setAlertConfig({
                isOpen: true,
                title: "Update Failed",
                message: "Failed to update profile: " + err.message,
                type: "danger"
            });
        }
        setProfileLoading(false);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            </div>
        );
    }

    const now = new Date();
    const upcomingApts = appointments.filter(a => a.status === 'scheduled' || a.status === 'in_progress');
    const pastApts = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

    // Filtered appointments for Medical History
    const filteredPast = pastApts.filter(a => {
        const matchSearch = !searchQuery ||
            a.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.symptoms?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDept = filterDepartment === 'all' || a.department === filterDepartment;
        const matchStatus = filterStatus === 'all' || a.status === filterStatus;
        const matchFrom = !dateFrom || a.date >= dateFrom;
        const matchTo = !dateTo || a.date <= dateTo;
        return matchSearch && matchDept && matchStatus && matchFrom && matchTo;
    });

    const tabs = [
        { id: 'upcoming', label: 'Appointments', icon: Calendar, count: upcomingApts.length },
        { id: 'vitals', label: 'Health Vitals', icon: Activity },
        { id: 'history', label: 'Medical History', icon: ClipboardList, count: pastApts.length },
        { id: 'prescriptions', label: 'Prescriptions', icon: Pill, count: prescriptions.length },
        { id: 'reports', label: 'AI Reports', icon: FileSearch },
        { id: 'settings', label: 'My Profile', icon: Settings },
    ];

    const inputStyle = {
        background: 'white', 
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-main)', 
        padding: '0.9rem 1rem',
        borderRadius: '14px', 
        width: '100%', 
        fontSize: '0.95rem',
        fontWeight: 500,
        transition: 'all 0.2s',
        outline: 'none'
    };

    const labelStyle = { 
        display: 'block', 
        fontSize: '0.75rem', 
        fontWeight: 800, 
        marginBottom: '0.6rem', 
        color: 'var(--text-soft)', 
        textTransform: 'uppercase', 
        letterSpacing: '1px' 
    };

    const renderAppointmentCard = (apt, showReschedule = false) => (
        <motion.div
            key={apt.id}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="glass-card"
            style={{
                padding: '1.25rem', 
                background: 'white',
                border: '1px solid var(--border-subtle)', 
                borderRadius: '16px',
                marginBottom: '0.75rem',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Dr. {apt.doctor_name}</h3>
                            <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{apt.department}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                            <Calendar size={14} style={{ color: 'var(--primary)' }} /> {apt.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                            <Clock size={14} style={{ color: 'var(--primary)' }} /> {apt.time}
                        </div>
                    </div>

                    {apt.symptoms && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                            {apt.symptoms.substring(0, 80)}{apt.symptoms.length > 80 ? '...' : ''}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <span style={{
                        padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase',
                        ...({
                            scheduled: { background: 'var(--primary-plus)', color: 'var(--primary)', border: '1px solid var(--border-subtle)' },
                            completed: { background: '#f0fdf4', color: '#10b981' },
                            cancelled: { background: '#fef2f2', color: '#ef4444' },
                            in_progress: { background: '#fffbeb', color: '#f59e0b' }
                        }[apt.status] || { background: 'var(--bg-color)', color: 'var(--text-soft)' })
                    }}>
                        {apt.status.replace('_', ' ')}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {showReschedule && apt.status === 'scheduled' && !apt.reschedule_requested && (
                            <button onClick={() => setRescheduleApt(apt)} className="btn-secondary" style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reschedule"><RefreshCw size={16} /></button>
                        )}
                        <Link to="/chat">
                            <button className="btn-secondary" style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Chat"><MessageSquare size={16} /></button>
                        </Link>
                    </div>
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
                        Patient Portal
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id} onClick={() => setActiveTab(tab.id)} 
                                style={{ 
                                    padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', 
                                    background: activeTab === tab.id ? 'var(--primary)' : 'transparent', 
                                    border: 'none', borderRadius: '10px', color: activeTab === tab.id ? 'white' : 'var(--text-main)', 
                                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, transition: '0.2s', position: 'relative'
                                }}
                            >
                                <tab.icon size={16} /> {tab.label}
                                {tab.count > 0 && <span style={{ position: 'absolute', right: '0.75rem', fontSize: '0.65rem', background: activeTab === tab.id ? 'white' : 'var(--primary-plus)', color: activeTab === tab.id ? 'var(--primary)' : 'var(--primary)', padding: '2px 6px', borderRadius: '6px' }}>{tab.count}</span>}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600, lineHeight: 1.4 }}>
                            Medical Tier {user.level || 1}
                        </p>
                        <div style={{ height: '6px', background: 'white', borderRadius: '10px', marginTop: '0.5rem', overflow: 'hidden' }}>
                            <div style={{ width: `${(user.xp % 1000) / 10}%`, height: '100%', background: 'var(--primary)' }} />
                        </div>
                        <button onClick={fetchData} style={{ marginTop: '1rem', width: '100%', background: 'white', border: '1px solid var(--border-subtle)', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            <RefreshCw size={12} /> Sync
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, padding: '1.5rem', marginLeft: '240px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{tabs.find(t=>t.id===activeTab).label}</h2>
                            <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 600 }}><UpdateProfileName /></p>
                        </div>
                    </div>


                {/* === UPCOMING TAB === */}
                {activeTab === 'upcoming' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {upcomingApts.length > 0 ? (
                            upcomingApts.map(apt => renderAppointmentCard(apt, true))
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                                <Calendar size={48} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>No upcoming appointments.</p>
                                <Link to="/checkup">
                                    <button style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'var(--text-main)', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                                        Book an AI Checkup
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* === VITALS TAB === */}
                {activeTab === 'vitals' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {/* Log Vitals Form */}
                            <div className="glass-card" style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                                <h3 style={{ margin: '0 0 1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Outfit, sans-serif' }}>
                                    <div style={{ padding: '0.5rem', background: 'var(--primary-glow)', borderRadius: '10px', color: 'var(--primary)' }}>
                                        <Activity size={20} />
                                    </div>
                                    Vital Metrics
                                </h3>
                                <form onSubmit={handleVitalsSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight (kg)</label>
                                        <input type="number" step="0.1" required value={vitalsForm.weight} onChange={e => setVitalsForm({...vitalsForm, weight: e.target.value})} style={inputStyle} placeholder="e.g., 72.5" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BP Systolic</label>
                                            <input type="number" required value={vitalsForm.bp_systolic} onChange={e => setVitalsForm({...vitalsForm, bp_systolic: e.target.value})} style={inputStyle} placeholder="120" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BP Diastolic</label>
                                            <input type="number" required value={vitalsForm.bp_diastolic} onChange={e => setVitalsForm({...vitalsForm, bp_diastolic: e.target.value})} style={inputStyle} placeholder="80" />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Glucose (mg/dL)</label>
                                        <input type="number" required value={vitalsForm.glucose} onChange={e => setVitalsForm({...vitalsForm, glucose: e.target.value})} style={inputStyle} placeholder="e.g., 95" />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn-primary"
                                        disabled={vitalsLoading}
                                        style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '14px', width: '100%', fontSize: '0.95rem' }}
                                    >
                                        {vitalsLoading ? 'Syncing...' : 'Log Metrics (+25 XP)'}
                                    </button>
                                </form>
                            </div>

                            {/* Info Card */}
                            <div className="glass-card" style={{ 
                                padding: '2rem', 
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)', 
                                border: '1px solid rgba(99, 102, 241, 0.15)', 
                                borderRadius: '24px', 
                                color: 'var(--primary)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
                                        <Star size={20} fill="currentColor" /> Health Intelligence
                                    </h3>
                                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)', opacity: 0.8, fontWeight: 500 }}>
                                        Regular vitals tracking enables our AI to build a comprehensive longitudinal profile of your health. 
                                        This helps in early detection of trends and provides your medical team with actionable data.
                                    </p>
                                </div>
                                <div style={{ 
                                    marginTop: '1.5rem', padding: '1.25rem', 
                                    background: 'white', borderRadius: '18px', 
                                    fontSize: '0.9rem', fontWeight: 700,
                                    border: '1px solid rgba(99, 102, 241, 0.1)',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                                }}>
                                    <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%' }} />
                                    Next Goal: Log vitals 3 more times for a Streak Bonus!
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="glass-card" style={{ padding: '2rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '24px', height: '450px' }}>
                            <h3 style={{ margin: '0 0 2rem', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Biometric Trends</h3>
                            {vitals.length > 0 ? (
                                <ResponsiveContainer width="100%" height="85%">
                                    <LineChart data={vitals}>
                                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                        <XAxis 
                                            dataKey="timestamp" 
                                            tickFormatter={(val) => val.split(' ')[0].slice(5)} 
                                            tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} 
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                background: 'white', 
                                                border: 'none', 
                                                borderRadius: '16px', 
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                padding: '1rem'
                                            }}
                                            itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                                        />
                                        <Line type="monotone" dataKey="weight" name="Weight" stroke="var(--primary)" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: 'white'}} activeDot={{r: 8, strokeWidth: 0}} />
                                        <Line type="monotone" dataKey="bp_systolic" name="BP Systolic" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                                        <Line type="monotone" dataKey="glucose" name="Glucose" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
                                    <Activity size={48} style={{ opacity: 0.1 }} />
                                    <p style={{ fontWeight: 500 }}>Insufficient data to generate trends. Start logging today!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* === MEDICAL HISTORY TAB === */}
                {activeTab === 'history' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Advanced Filters */}
                        <div className="glass-card" style={{ 
                            background: 'white', 
                            border: '1px solid var(--border-subtle)', 
                            borderRadius: '24px', 
                            padding: '1.5rem', 
                            marginBottom: '2rem', 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                            gap: '1rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
                                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    placeholder="Search doctor or symptoms..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{ ...inputStyle, paddingLeft: '44px' }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Filter size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                                <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px', appearance: 'none', cursor: 'pointer' }}>
                                    <option value="all">Specialization</option>
                                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                    <option value="all">Status: All</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', gridColumn: 'span 2' }}>
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                            </div>
                        </div>

                        {filteredPast.length > 0 ? (
                            filteredPast.map(apt => renderAppointmentCard(apt, false))
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                                <FileText size={48} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-muted)' }}>No appointment history found.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* === PRESCRIPTIONS TAB === */}
                {activeTab === 'prescriptions' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                        {prescriptions.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                {prescriptions.map(rx => (
                                    <motion.div 
                                        key={rx.id} 
                                        whileHover={{ y: -4 }}
                                        style={{ 
                                            padding: '2rem', 
                                            background: 'rgba(255, 255, 255, 0.8)', 
                                            border: '1px solid var(--border-subtle)', 
                                            borderRadius: '28px', 
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '2rem' }}>
                                            <div style={{ flex: 1, minWidth: '300px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                                    <div style={{ 
                                                        width: '40px', height: '40px', borderRadius: '12px', 
                                                        background: 'rgba(16, 185, 129, 0.1)', display: 'flex', 
                                                        alignItems: 'center', justifyContent: 'center', color: '#10b981' 
                                                    }}>
                                                        <Pill size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)' }}>
                                                            {rx.diagnosis}
                                                        </h3>
                                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                            Issued by Dr. {rx.doctor_name} • {rx.issued_at?.toString().split('T')[0] || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem' }}>
                                                    {(rx.medications || []).map((med, i) => (
                                                        <div key={i} style={{ 
                                                            padding: '1rem 1.25rem', 
                                                            background: 'white', 
                                                            borderRadius: '16px', 
                                                            border: '1px solid var(--border-subtle)',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <div>
                                                                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>{med.name}</div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{med.dosage} • {med.frequency}</div>
                                                            </div>
                                                            <div style={{ 
                                                                padding: '0.4rem 0.8rem', background: 'var(--bg-color)', 
                                                                borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                                                                color: 'var(--primary)'
                                                            }}>
                                                                {med.duration}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {rx.notes && (
                                                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '14px', fontSize: '0.85rem', color: 'var(--text-muted)', borderLeft: '4px solid var(--primary)' }}>
                                                        <span style={{ fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.7rem' }}>Physician's Note</span>
                                                        "{rx.notes}"
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '160px' }}>
                                                <button
                                                    onClick={() => downloadPrescription(rx)}
                                                    className="btn-primary"
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.9rem', borderRadius: '16px', fontSize: '0.9rem' }}
                                                >
                                                    <Download size={18} /> Get Digital Copy
                                                </button>
                                                <button
                                                    onClick={() => setViewPrescription(rx)}
                                                    className="btn-secondary"
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.9rem', borderRadius: '16px', fontSize: '0.9rem' }}
                                                >
                                                    <FileText size={18} /> View Details
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'white', borderRadius: '32px', border: '1px dashed var(--border-subtle)' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.3 }}>
                                    <Pill size={40} />
                                </div>
                                <h3 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Prescriptions Yet</h3>
                                <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto' }}>Once a doctor issues a prescription, it will appear here for easy access.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* === HEALTH REPORTS TAB === */}
                {activeTab === 'reports' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            <div className="glass-card" style={{ padding: '3rem 2.5rem', textAlign: 'center', background: 'white', borderRadius: '32px', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)' }}>
                                <div style={{ width: '64px', height: '64px', background: 'var(--primary-glow)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                    <FileSearch size={32} />
                                </div>
                                <h2 style={{ margin: '0 0 0.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-main)', fontSize: '1.75rem' }}>AI Report Analysis</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, fontSize: '1.05rem' }}>
                                    Upload clinical lab results or diagnostic reports. Our medical intelligence engine will synthesize a human-readable summary.
                                </p>

                                <div style={{ position: 'relative', padding: '3rem 2rem', border: '2px dashed var(--primary-light)', borderRadius: '24px', background: 'rgba(99, 102, 241, 0.02)', marginBottom: '2rem', transition: 'all 0.2s' }}>
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        onChange={e => setReportFile(e.target.files[0])}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 1 }} 
                                    />
                                    <Upload size={40} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.6 }} />
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                        {reportFile ? reportFile.name : 'Drop your PDF report here'}
                                    </p>
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Max file size 5MB • PDF format only</p>
                                </div>

                                {reportFile && (
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                        <button 
                                            onClick={handleReportUpload}
                                            disabled={reportLoading}
                                            className="btn-primary"
                                            style={{ padding: '1rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}
                                        >
                                            {reportLoading ? <RefreshCw size={20} style={{ animation: 'spin 1.5s linear infinite' }} /> : <Zap size={20} fill="currentColor" />}
                                            {reportLoading ? 'Processing...' : 'Analyze Report (+100 XP)'}
                                        </button>
                                        <button 
                                            onClick={() => setReportFile(null)}
                                            className="btn-secondary"
                                            style={{ padding: '1rem', borderRadius: '16px', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                            title="Remove File"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {reportSummary && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.98 }} 
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ 
                                            marginTop: '2rem', padding: '2.5rem', 
                                            background: 'white', border: '1px solid var(--primary-light)', 
                                            borderRadius: '32px', boxShadow: '0 25px 60px -12px rgba(99, 102, 241, 0.12)',
                                            position: 'relative', overflow: 'hidden'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'var(--primary)' }} />
                                        <h3 style={{ margin: '0 0 1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
                                            <div style={{ padding: '0.4rem', background: 'var(--primary-glow)', borderRadius: '8px' }}>
                                                <Zap size={18} fill="currentColor" />
                                            </div>
                                            Clinical Synthesis
                                        </h3>
                                        <div style={{ color: 'var(--text-main)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1.05rem', fontWeight: 500 }}>
                                            {reportSummary}
                                        </div>
                                        <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--bg-color)', borderRadius: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                                            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <p style={{ margin: 0 }}><strong>Decision Support Only:</strong> This AI-generated summary is for informational awareness. Final medical decisions should always be made by a licensed healthcare provider based on the full clinical context.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* === SETTINGS TAB === */}
                {activeTab === 'settings' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            <div className="glass-card" style={{ padding: '3rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'var(--primary-glow)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <UserIcon size={40} />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem' }}>Personal Profile</h2>
                                        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Securely manage your health credentials</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gap: '2rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                                        <input 
                                            type="text" 
                                            value={profileFormData.full_name} 
                                            onChange={e => setProfileFormData({...profileFormData, full_name: e.target.value})} 
                                            style={inputStyle} 
                                            placeholder="e.g., Jonathan Harker" 
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Age</label>
                                            <input 
                                                type="number" 
                                                value={profileFormData.age} 
                                                onChange={e => setProfileFormData({...profileFormData, age: e.target.value})} 
                                                style={inputStyle} 
                                                placeholder="Enter age" 
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender Identity</label>
                                            <select 
                                                value={profileFormData.gender} 
                                                onChange={e => setProfileFormData({...profileFormData, gender: e.target.value})} 
                                                style={{...inputStyle, appearance: 'none', cursor: 'pointer'}}
                                            >
                                                <option value="">Select Identity</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Non-binary / Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Residential Address</label>
                                        <textarea 
                                            value={profileFormData.address} 
                                            onChange={e => setProfileFormData({...profileFormData, address: e.target.value})} 
                                            rows={3} 
                                            style={{...inputStyle, resize: 'none', lineHeight: 1.6}} 
                                            placeholder="Complete street address, City, ZIP" 
                                        />
                                    </div>
                                    <motion.button 
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit" 
                                        className="btn-primary"
                                        disabled={profileLoading}
                                        style={{ 
                                            marginTop: '1rem', 
                                            padding: '1.1rem', 
                                            borderRadius: '18px',
                                            fontSize: '1.05rem',
                                            boxShadow: '0 15px 30px -10px rgba(99, 102, 241, 0.3)'
                                        }}
                                    >
                                        {profileLoading ? 'Synchronizing...' : 'Update Medical Records'}
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
                </div>
            </div>

            <AnimatePresence>
                {rescheduleApt && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1.5rem' }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="glass-card"
                            style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', maxWidth: '480px', width: '100%', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.15)', border: '1px solid var(--border-subtle)' }}
                        >
                            {rescheduleSuccess ? (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                                        <CheckCircle size={48} />
                                    </div>
                                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Request Logged</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>Dr. {rescheduleApt.doctor_name}'s team will review your request and confirm via notification.</p>
                                    <button onClick={() => setRescheduleApt(null)} className="btn-primary" style={{ marginTop: '2rem', padding: '1rem 2.5rem', borderRadius: '14px' }}>Great, thanks</button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>Propose Reschedule</h3>
                                        <button onClick={() => setRescheduleApt(null)} style={{ background: 'var(--bg-color)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.5rem', borderRadius: '50%' }}><XCircle size={22} /></button>
                                    </div>
                                    
                                    <div style={{ padding: '1.25rem', background: 'var(--bg-color)', borderRadius: '20px', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Current Slot</p>
                                        <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem', fontWeight: 600 }}>
                                            {rescheduleApt.date} at {rescheduleApt.time} with Dr. {rescheduleApt.doctor_name}
                                        </p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Date</label>
                                            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Time</label>
                                            <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reason for Change</label>
                                        <textarea value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)} rows={3} placeholder="Tell us why you need to move this..." style={{ ...inputStyle, resize: 'none' }} />
                                    </div>

                                    <motion.button
                                        whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                                        onClick={handleReschedule} disabled={rescheduleLoading || !newDate || !newTime}
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '1.1rem', borderRadius: '18px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                                    >
                                        {rescheduleLoading ? <RefreshCw size={20} style={{ animation: 'spin 1.5s linear infinite' }} /> : <Send size={20} />}
                                        {rescheduleLoading ? 'Syncing...' : 'Submit Proposal (+10 XP)'}
                                    </motion.button>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewApt && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1.5rem' }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="glass-card"
                            style={{ background: 'white', borderRadius: '32px', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center', border: '1px solid var(--border-subtle)' }}
                        >
                            {reviewSuccess ? (
                                <div style={{ padding: '1rem' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                                        <Star size={40} fill="currentColor" />
                                    </div>
                                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Rating Submitted!</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>Your feedback helps us maintain the highest standards of clinical excellence.</p>
                                    <button onClick={() => setReviewApt(null)} className="btn-primary" style={{ marginTop: '2rem', padding: '1rem 2.5rem', borderRadius: '14px' }}>Close</button>
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem' }}>Clinical Feedback</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: 500 }}>Rate your experience with Dr. {reviewApt.doctor_name}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <motion.button
                                                key={star}
                                                whileHover={{ scale: 1.2, rotate: 15 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setReviewRating(star)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: star <= reviewRating ? '#fbbf24' : 'var(--bg-color)' }}
                                            >
                                                <Star size={44} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                                            </motion.button>
                                        ))}
                                    </div>

                                    <textarea
                                        value={reviewComment}
                                        onChange={e => setReviewComment(e.target.value)}
                                        placeholder="Tell us about the consultation (optional)..."
                                        rows={4}
                                        style={{ ...inputStyle, resize: 'none', marginBottom: '2.5rem', textAlign: 'left' }}
                                    />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                        <button onClick={() => setReviewApt(null)} className="btn-secondary" style={{ padding: '1.1rem', borderRadius: '18px', fontSize: '1rem' }}>Cancel</button>
                                        <motion.button
                                            whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                                            onClick={submitReview}
                                            disabled={reviewLoading || reviewRating === 0}
                                            className="btn-primary"
                                            style={{ padding: '1.1rem', borderRadius: '18px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                                        >
                                            {reviewLoading ? <RefreshCw size={20} style={{ animation: 'spin 1.5s linear infinite' }} /> : <MessageSquare size={20} />}
                                            {reviewLoading ? 'Sending...' : 'Post Feedback (+50 XP)'}
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Prescription View Modal */}
            <AnimatePresence>
                {viewPrescription && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1.5rem' }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="glass-card"
                            style={{ background: 'white', borderRadius: '28px', padding: '2rem', maxWidth: '480px', width: '100%', border: '1px solid var(--border-subtle)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.12)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '44px', height: '44px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <Pill size={22} />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)' }}>Prescription</h2>
                                        <p style={{ margin: '0.1rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>ID: RX-{viewPrescription.id?.slice(-8) || 'N/A'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewPrescription(null)} style={{ background: 'var(--bg-color)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.4rem', borderRadius: '50%' }}><XCircle size={20} /></button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={labelStyle}>Patient</p>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{viewPrescription.patient_name || user?.full_name}</p>
                                    <p style={{ margin: '0.1rem 0 0', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>UID: {user?.uid?.slice(-6) || 'N/A'}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={labelStyle}>Physician</p>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>Dr. {viewPrescription.doctor_name}</p>
                                    <p style={{ margin: '0.1rem 0 0', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={labelStyle}>Diagnosis</p>
                                <div style={{ padding: '0.75rem 1rem', background: 'rgba(99, 102, 241, 0.03)', borderRadius: '14px', border: '1px solid var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>
                                    {viewPrescription.diagnosis}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={labelStyle}>Medication Regimen</p>
                                <div style={{ display: 'grid', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto' }} className="custom-scrollbar">
                                    {(viewPrescription.medications || []).map((med, i) => (
                                        <div key={i} style={{ padding: '0.75rem 1rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>{med.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{med.dosage} • {med.frequency}</div>
                                            </div>
                                            <div style={{ padding: '0.3rem 0.6rem', background: 'white', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', border: '1px solid var(--border-subtle)' }}>
                                                {med.duration}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {viewPrescription.notes && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <p style={labelStyle}>Directives</p>
                                    <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, fontStyle: 'italic' }}>"{viewPrescription.notes}"</p>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <button onClick={() => setViewPrescription(null)} className="btn-secondary" style={{ padding: '0.85rem', borderRadius: '14px', fontSize: '0.9rem' }}>Close</button>
                                <motion.button 
                                    whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                                    onClick={() => downloadPrescription(viewPrescription)} 
                                    className="btn-primary" 
                                    style={{ padding: '0.85rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '0.9rem' }}
                                >
                                    <Download size={18} /> Get PDF
                                </motion.button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AlertModal 
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </div>
    );
};

export default PatientDashboard;
