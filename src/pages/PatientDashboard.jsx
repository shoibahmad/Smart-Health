import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, MessageSquare, RefreshCw, FileText } from 'lucide-react';
import { getAppointments } from '../services/api';
import UpdateProfileName from '../components/UpdateProfileName';

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

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
            const apts = await getAppointments();

            // Sort by nearest date first
            apts.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });

            setAppointments(apts);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '120px', textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <RefreshCw size={40} style={{ color: 'var(--primary)' }} />
                </motion.div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your dashboard...</p>
            </div>
        );
    }

    // Separate upcoming and past appointments
    const now = new Date();
    const upcomingApts = appointments.filter(a => new Date(`${a.date}T${a.time}`) >= now || a.status === 'scheduled');
    const pastApts = appointments.filter(a => new Date(`${a.date}T${a.time}`) < now && a.status !== 'scheduled');

    const renderAppointmentCard = (apt, isPast) => (
        <div key={apt.id} style={{
            padding: '1.5rem',
            background: '#ffffff',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Dr. {apt.doctor_name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Calendar size={16} /> {apt.date}
                        <span style={{ margin: '0 0.5rem' }}>•</span>
                        <Clock size={16} /> {apt.time}
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={16} /> {apt.department}
                    </p>
                    {apt.symptoms && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            <strong>Reported Symptoms:</strong> {apt.symptoms}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <span style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: apt.status === 'scheduled' ? 'var(--primary-bg)' : apt.status === 'completed' ? '#dcfce7' : '#fee2e2',
                        color: apt.status === 'scheduled' ? 'var(--primary)' : apt.status === 'completed' ? '#166534' : 'var(--danger)',
                        textTransform: 'capitalize'
                    }}>
                        {apt.status}
                    </span>

                    {!isPast && (
                        <Link to="/chat" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '0.6rem 1rem',
                                background: 'white',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-main)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-main)'; }}>
                                <MessageSquare size={16} /> Message Doctor
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '900px', margin: '0 auto', padding: '100px 1.5rem 4rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header Profile Summary */}
                <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
                    borderRadius: '24px',
                    color: 'white',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)'
                }}>
                    <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Welcome, <UpdateProfileName /></h1>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>Manage your appointments and medical history.</p>
                </div>

                {/* Upcoming Appointments */}
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        <Calendar size={24} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ margin: 0 }}>Upcoming Appointments</h2>
                    </div>

                    {upcomingApts.length > 0 ? (
                        <div>
                            {upcomingApts.map(apt => renderAppointmentCard(apt, false))}
                        </div>
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>No upcoming appointments scheduled.</p>
                            <Link to="/ai-checkup">
                                <button style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    Book an AI Checkup
                                </button>
                            </Link>
                        </div>
                    )}
                </section>

                {/* Past Appointments */}
                {pastApts.length > 0 && (
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                            <FileText size={24} style={{ color: 'var(--primary)' }} />
                            <h2 style={{ margin: 0 }}>Appointment History</h2>
                        </div>
                        <div style={{ opacity: 0.8 }}>
                            {pastApts.map(apt => renderAppointmentCard(apt, true))}
                        </div>
                    </section>
                )}
            </motion.div>
        </div>
    );
};

export default PatientDashboard;
