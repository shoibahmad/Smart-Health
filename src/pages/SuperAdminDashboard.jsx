import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, UserCog, Calendar, Shield, ChevronDown, ChevronUp,
    Trash2, Search, TrendingUp, Activity, Clock, RefreshCw,
    PieChart, UserPlus, AlertCircle
} from 'lucide-react';

import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SuperAdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedUser, setExpandedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'superuser') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setUsers(usersList);
            setDoctors(usersList.filter(u => u.role === 'doctor'));
            setPatients(usersList.filter(u => u.role === 'user' || u.role === 'patient'));

            const appointmentsSnapshot = await getDocs(collection(db, "appointments"));
            const appointmentsList = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAppointments(appointmentsList);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
        setLoading(false);
    };

    const updateRole = async (userId, newRole) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: newRole });
            fetchData();
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, "users", userId));
            fetchData();
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: PieChart },
        { id: 'users', label: 'All Users', icon: Users, count: users.length },
        { id: 'doctors', label: 'Doctors', icon: UserCog, count: doctors.length },
        { id: 'patients', label: 'Patients', icon: Users, count: patients.length },
        { id: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
    ];

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'superuser': return { bg: 'rgba(244, 114, 182, 0.2)', color: '#f472b6' };
            case 'doctor': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399' };
            default: return { bg: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa' };
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const scheduledApts = appointments.filter(a => a.status === 'scheduled').length;
    const completedApts = appointments.filter(a => a.status === 'completed').length;

    if (loading) {
        return (
            <div style={{ paddingTop: '120px', textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <RefreshCw size={40} style={{ color: '#8b5cf6' }} />
                </motion.div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '100px', padding: '100px 2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f472b6, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(244, 114, 182, 0.3)'
                    }}>
                        <Shield size={28} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem' }}>Admin Portal</h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your platform</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchData}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        padding: '0.75rem 1.25rem'
                    }}
                >
                    <RefreshCw size={18} /> Refresh Data
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: activeTab === tab.id ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            boxShadow: activeTab === tab.id ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none'
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {tab.count !== undefined && (
                            <span style={{
                                background: 'rgba(255,255,255,0.2)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '10px',
                                fontSize: '0.75rem'
                            }}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Total Users</p>
                                    <h2 style={{ margin: '0.5rem 0', fontSize: '2.5rem' }}>{users.length}</h2>
                                    <p style={{ color: '#10b981', margin: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <TrendingUp size={14} /> Active platform
                                    </p>
                                </div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={24} style={{ color: '#60a5fa' }} />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Doctors</p>
                                    <h2 style={{ margin: '0.5rem 0', fontSize: '2.5rem' }}>{doctors.length}</h2>
                                    <p style={{ color: '#34d399', margin: 0, fontSize: '0.85rem' }}>Medical professionals</p>
                                </div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserCog size={24} style={{ color: '#34d399' }} />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Patients</p>
                                    <h2 style={{ margin: '0.5rem 0', fontSize: '2.5rem' }}>{patients.length}</h2>
                                    <p style={{ color: '#8b5cf6', margin: 0, fontSize: '0.85rem' }}>Registered users</p>
                                </div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={24} style={{ color: '#8b5cf6' }} />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Appointments</p>
                                    <h2 style={{ margin: '0.5rem 0', fontSize: '2.5rem' }}>{appointments.length}</h2>
                                    <p style={{ color: '#06b6d4', margin: 0, fontSize: '0.85rem' }}>{scheduledApts} scheduled</p>
                                </div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Calendar size={24} style={{ color: '#06b6d4' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={20} style={{ color: '#8b5cf6' }} /> User Distribution
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { label: 'Patients', count: patients.length, color: '#60a5fa', percent: (patients.length / users.length * 100) || 0 },
                                    { label: 'Doctors', count: doctors.length, color: '#34d399', percent: (doctors.length / users.length * 100) || 0 },
                                    { label: 'Admins', count: users.filter(u => u.role === 'superuser').length, color: '#f472b6', percent: (users.filter(u => u.role === 'superuser').length / users.length * 100) || 0 },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span>{item.label}</span>
                                            <span style={{ color: item.color }}>{item.count} ({item.percent.toFixed(0)}%)</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.percent}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                                style={{ height: '100%', background: item.color, borderRadius: '4px' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={20} style={{ color: '#06b6d4' }} /> Appointment Status
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { label: 'Scheduled', count: scheduledApts, color: '#60a5fa' },
                                    { label: 'Completed', count: completedApts, color: '#34d399' },
                                    { label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length, color: '#f87171' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                                            {item.label}
                                        </span>
                                        <span style={{ fontWeight: 600, color: item.color }}>{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* All Users Tab */}
            {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h2 style={{ margin: 0 }}>All Users ({users.length})</h2>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '40px', marginBottom: 0, width: '250px' }}
                            />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Role</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <React.Fragment key={u.id}>
                                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem' }}>{u.full_name}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.3rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    background: getRoleBadgeColor(u.role).bg,
                                                    color: getRoleBadgeColor(u.role).color,
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                                                        style={{
                                                            background: 'rgba(139, 92, 246, 0.15)',
                                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                                            padding: '0.4rem 0.75rem',
                                                            fontSize: '0.8rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        Role {expandedUser === u.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </button>
                                                    {u.role !== 'superuser' && (
                                                        <button
                                                            onClick={() => setDeleteConfirm(u.id)}
                                                            style={{
                                                                background: 'rgba(248, 113, 113, 0.15)',
                                                                border: '1px solid rgba(248, 113, 113, 0.3)',
                                                                padding: '0.4rem 0.5rem',
                                                                color: '#f87171'
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedUser === u.id && (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.03)' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        {['user', 'doctor', 'superuser'].map(role => (
                                                            <button
                                                                key={role}
                                                                onClick={() => { updateRole(u.id, role); setExpandedUser(null); }}
                                                                disabled={u.role === role}
                                                                style={{
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '8px',
                                                                    border: 'none',
                                                                    background: u.role === role ? 'var(--glass-border)' : getRoleBadgeColor(role).bg,
                                                                    color: u.role === role ? 'var(--text-muted)' : getRoleBadgeColor(role).color,
                                                                    cursor: u.role === role ? 'not-allowed' : 'pointer',
                                                                    textTransform: 'capitalize'
                                                                }}
                                                            >
                                                                {role === 'superuser' ? 'Admin' : role}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem' }}>All Doctors ({doctors.length})</h2>
                    {doctors.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <UserCog size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No doctors registered yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            {doctors.map(doc => (
                                <div key={doc.id} style={{
                                    padding: '1.5rem',
                                    background: 'rgba(52, 211, 153, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(52, 211, 153, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #34d399, #10b981)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem', fontWeight: 700, color: 'white'
                                        }}>
                                            {doc.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{doc.full_name}</h3>
                                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{doc.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem' }}>All Patients ({patients.length})</h2>
                    {patients.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No patients registered yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {patients.map(p => (
                                <div key={p.id} style={{
                                    padding: '1.25rem',
                                    background: 'rgba(96, 165, 250, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(96, 165, 250, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1rem', fontWeight: 700, color: 'white'
                                    }}>
                                        {p.full_name?.charAt(0)}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <p style={{ margin: 0, fontWeight: 600 }}>{p.full_name}</p>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem' }}>All Appointments ({appointments.length})</h2>
                    {appointments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No appointments yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {appointments.map(apt => (
                                <div key={apt.id} style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ marginBottom: '0.5rem' }}>{apt.patient_name}</h3>
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                📋 {apt.department} • 📅 {apt.date} at {apt.time}
                                            </p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>💊 {apt.symptoms || 'No symptoms specified'}</p>
                                        </div>
                                        <span style={{
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            background: apt.status === 'scheduled' ? 'rgba(96, 165, 250, 0.2)' :
                                                apt.status === 'completed' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                                            color: apt.status === 'scheduled' ? '#60a5fa' :
                                                apt.status === 'completed' ? '#34d399' : '#f87171',
                                            textTransform: 'capitalize'
                                        }}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card"
                        style={{ maxWidth: '400px', textAlign: 'center' }}
                    >
                        <AlertCircle size={48} style={{ color: '#f87171', marginBottom: '1rem' }} />
                        <h3>Delete User?</h3>
                        <p style={{ color: 'var(--text-muted)' }}>This action cannot be undone. The user will be permanently removed.</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                            <button onClick={() => deleteUser(deleteConfirm)} style={{ flex: 1, background: 'linear-gradient(90deg, #ef4444, #f97316)' }}>Delete</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
