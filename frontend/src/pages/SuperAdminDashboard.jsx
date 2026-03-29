import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, Activity, Calendar, Shield, Trash2, Search, Filter, ShieldAlert, CheckCircle, RefreshCw, BarChart2, DollarSign, FileText, Target, TrendingUp, Zap
} from 'lucide-react';
import AlertModal from '../components/AlertModal';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

import {
    getUsers, updateUserRole, deleteUser, getAppointments,
    getAnalyticsOverview, getRevenueAnalytics, getAuditLogs, getNoshowRisks
} from '../services/api';

const COLORS = ['var(--primary)', 'var(--primary-light)', '#10b981', '#fbbf24', '#ef4444', '#6366f1'];
const SuperAdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // State
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [analytics, setAnalytics] = useState(null);
    const [revenue, setRevenue] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [mlRisks, setMlRisks] = useState([]);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null, confirmText: 'Confirm' });

    const inputStyle = {
        padding: '0.5rem 1rem',
        background: 'var(--bg-color)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        color: 'var(--text-main)',
        fontSize: '0.85rem',
        fontWeight: 500,
        outline: 'none'
    };

    useEffect(() => {
        if (!user || (user.role !== 'superadmin' && user.role !== 'admin')) {
            navigate('/');
            return;
        }
        fetchData();
        fetchExtendedData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, aptData] = await Promise.all([getUsers(), getAppointments()]);
            setUsers(usersData);
            setAppointments(aptData);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const fetchExtendedData = async () => {
        try {
            const [anl, rev, logs, risks] = await Promise.all([
                getAnalyticsOverview(), getRevenueAnalytics(), getAuditLogs(50), getNoshowRisks()
            ]);
            setAnalytics(anl);
            setRevenue(rev);
            setAuditLogs(logs);
            setMlRisks(risks);
        } catch (error) { console.error(error); }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        if (newRole === 'superadmin') {
            setAlertConfig({ isOpen: true, title: "Restricted", message: "Cannot assign superadmin role.", type: "warning" });
            return;
        }
        await updateUserRole(userId, newRole);
        fetchData();
    };

    const handleDeleteUser = async (userId) => {
        setAlertConfig({
            isOpen: true, title: "Delete User", message: "Confirm deletion?", type: "danger", confirmText: "Delete",
            onConfirm: async () => { await deleteUser(userId); fetchData(); }
        });
    };

    const tabs = [
        { id: 'overview', label: 'Access Control', icon: Shield },
        { id: 'analytics', label: 'Intelligence', icon: BarChart2 },
        { id: 'revenue', label: 'Financials', icon: DollarSign },
        { id: 'audit', label: 'Security', icon: FileText },
        { id: 'ml', label: 'Predictive', icon: Target },
    ];

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '72px' }}>
            {/* Sidebar */}
            <div style={{ width: '240px', background: 'white', borderRight: '1px solid var(--border-subtle)', padding: '1.5rem 1rem', position: 'fixed', top: '72px', bottom: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {tabs.map(tab => (
                        <button 
                            key={tab.id} onClick={() => setActiveTab(tab.id)} 
                            style={{ 
                                padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', 
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
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{tabs.find(t=>t.id===activeTab)?.label}</h2>
                        <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 600 }}>Administrative Control Node</p>
                    </div>
                    <button onClick={() => { fetchData(); fetchExtendedData(); }} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RefreshCw size={14} /> Sync
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[
                                { label: 'Users', val: users.length, icon: Users, color: 'var(--primary)' },
                                { label: 'Physicians', val: users.filter(u=>u.role==='doctor').length, icon: Activity, color: '#06b6d4' },
                                { label: 'Patients', val: users.filter(u=>u.role==='patient').length, icon: Shield, color: '#10b981' },
                                { label: 'Sessions', val: appointments.length, icon: Calendar, color: '#fbbf24' }
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.25rem', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}><s.icon size={18} /></div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981' }}>+Active</span>
                                    </div>
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{s.val}</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>User Directory</h3>
                                <input placeholder="Search identifier..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={inputStyle} />
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-soft)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '0.75rem 1rem' }}>Identity</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Classification</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--primary)', fontSize: '0.75rem' }}>{u.full_name?.[0] || 'U'}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{u.full_name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)' }}>{u.role}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <select value={u.role} onChange={e=>handleRoleUpdate(u.id, e.target.value)} style={{ ...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                        <option value="patient">Patient</option>
                                                        <option value="doctor">Doctor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '0.4rem', borderRadius: '8px', background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'analytics' && analytics && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="glass-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem' }}>Physician Engagement</h3>
                                <div style={{ height: 240 }}><ResponsiveContainer><LineChart data={analytics.daily_trend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" hide /><YAxis hide /><RechartsTooltip /><Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div>
                            </div>
                            <div className="glass-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem' }}>Dept Load</h3>
                                <div style={{ height: 240 }}><ResponsiveContainer><BarChart data={analytics.department_utilization}><XAxis dataKey="department" hide /><YAxis hide /><RechartsTooltip /><Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'revenue' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gap: '1rem' }}>
                        {revenue ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)', borderLeft: '4px solid #10b981' }}>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Clinical Revenue</p>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>₹{revenue.total_revenue?.toLocaleString() || '0.00'}</h2>
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑ 12.5% vs Last Period</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)', borderLeft: '4px solid #fbbf24' }}>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending Settlements</p>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>₹{revenue.pending_revenue?.toLocaleString() || '0.00'}</h2>
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>Awaiting Verification</div>
                                    </div>
                                    <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--primary)' }}>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Avg. Consultation Fee</p>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>₹145.00</h2>
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>Platform Standard</div>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem' }}>Revenue Velocity</h3>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={revenue.revenue_by_month || []}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-soft)' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-soft)' }} />
                                                <RechartsTooltip 
                                                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                                    itemStyle={{ fontWeight: 800 }}
                                                />
                                                <Bar dataKey="amount" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-soft)' }}>
                                <RefreshCw size={40} style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem', opacity: 0.3 }} />
                                <p style={{ fontWeight: 700 }}>Synchronizing Financial Data...</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'audit' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>System Audit Logs</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' }}>Critical Events: 0</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', color: 'var(--text-soft)' }}>Total Logs: {auditLogs.length}</div>
                                </div>
                            </div>
                            <div style={{ maxHeight: '600px', overflowY: 'auto' }} className="custom-scrollbar">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-soft)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                            <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Principal</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Operation</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Parameters</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map((log, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-soft)', fontFamily: 'monospace' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                                <td style={{ padding: '0.75rem 1rem' }}><span style={{ fontWeight: 800 }}>{log.user_email || 'System'}</span></td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <span style={{ 
                                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900,
                                                        background: log.action?.includes('DELETE') ? '#fef2f2' : log.action?.includes('CREATE') ? '#f0fdf4' : '#eff6ff',
                                                        color: log.action?.includes('DELETE') ? '#ef4444' : log.action?.includes('CREATE') ? '#16a34a' : '#2563eb'
                                                    }}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-soft)', fontSize: '0.7rem' }}>
                                                    {typeof log.details === 'object' 
                                                        ? Object.entries(log.details).map(([k, v]) => `${k}: ${v}`).join(' | ') 
                                                        : (log.details || 'No additional context')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'ml' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Predicted No-Shows</p>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: '#f59e0b' }}>{mlRisks.filter(r=>r.risk_score > 0.7).length} <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>High Risk</span></h2>
                            </div>
                            <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Model Confidence</p>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'var(--primary)' }}>94.2%</h2>
                            </div>
                            <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Optimized Capacity</p>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: '#10b981' }}>+18%</h2>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem' }}>No-Show Pipeline Analysis</h3>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="custom-scrollbar">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-soft)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                            <th style={{ padding: '0.75rem 1rem' }}>Patient Node</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Scheduled Session</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Risk Score</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Counter-Measures</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mlRisks.map((risk, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{risk.patient_name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>Historical reliability: {(100 - (risk.historical_noshow_rate * 100)).toFixed(1)}%</div>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{risk.appointment_date}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>{risk.doctor_name}</div>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-color)', borderRadius: '3px', marginBottom: '4px' }}>
                                                        <div style={{ width: `${risk.risk_score * 100}%`, height: '100%', background: risk.risk_score > 0.7 ? '#ef4444' : risk.risk_score > 0.4 ? '#f59e0b' : '#10b981', borderRadius: '3px' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: risk.risk_score > 0.7 ? '#ef4444' : 'var(--text-soft)' }}>{(risk.risk_score * 100).toFixed(1)}% Velocity</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <button style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--primary-glow)', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 800 }}>Auto-Remind</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {mlRisks.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-soft)', fontWeight: 600 }}>No active risk vectors detected.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

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
    );
};

export default SuperAdminDashboard;
