import React, { useState, useEffect } from 'react';
import { getDoctors, scheduleAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, Lock, ShieldCheck, X, Calendar, 
    CheckCircle2, Star, RefreshCw 
} from 'lucide-react';
import AlertModal from './AlertModal';

const generateTimeSlots = (doctor, selectedDateStr) => {
    const selectedDate = new Date(selectedDateStr);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    const settings = doctor.schedule_settings || {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '09:00',
        end_time: '17:00'
    };

    if (!settings.days.includes(dayOfWeek)) {
        return [];
    }

    const slots = [];
    let currentStr = settings.start_time;
    const endStr = settings.end_time;
    let index = 0;

    while (currentStr < endStr) {
        slots.push({
            id: `${doctor.id}-${index}`,
            time: currentStr,
            doctor_id: doctor.id,
            doctor_name: doctor.full_name || doctor.name || 'Dr. Specialist',
            doctor_email: doctor.email || '',
            department: doctor.profile?.specialization || 'General',
            is_available: Math.random() > 0.2
        });

        let [hours, mins] = currentStr.split(':').map(Number);
        mins += 30;
        if (mins >= 60) {
            hours += 1;
            mins -= 60;
        }
        currentStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        index++;
    }

    return slots.filter(s => s.is_available);
};

// Modernized BookingFlow with Premium Glassmorphism
const BookingFlow = ({ analysis }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [patientName, setPatientName] = useState(user?.full_name || '');
    const [bookingStatus, setBookingStatus] = useState(null);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const [showPayment, setShowPayment] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    // Premium Styles matching Dashboard
    const inputStyle = {
        width: '100%',
        padding: '1rem 1.25rem',
        background: 'var(--bg-color)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        color: 'var(--text-main)',
        fontSize: '1rem',
        fontWeight: 500,
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'Outfit, sans-serif'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.75rem',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const allDoctors = await getDoctors();
            const dept = analysis?.department;
            let matchedDoctors = allDoctors;
            if (dept) {
                matchedDoctors = allDoctors.filter(d =>
                    d.profile?.specialization?.toLowerCase() === dept.toLowerCase()
                );
                if (matchedDoctors.length === 0) matchedDoctors = allDoctors;
            }

            if (matchedDoctors.length === 0) {
                matchedDoctors = [{ id: 'dummy-1', full_name: 'Dr. System', email: 'doctor@example.com', profile: { specialization: dept || 'General' } }];
            }

            let allSlots = [];
            matchedDoctors.slice(0, 3).forEach(doc => {
                allSlots = [...allSlots, ...generateTimeSlots(doc, date)];
            });

            allSlots.sort((a, b) => a.time.localeCompare(b.time));
            setSlots(allSlots);
            setSelectedSlot(null);
        } catch (error) {
            console.error("Failed to fetch slots", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSlots();
    }, [date, analysis?.department]);

    const initiateBooking = () => {
        if (!selectedSlot || !patientName || !user) {
            setAlertConfig({
                isOpen: true,
                title: "Information Required",
                message: "Please ensure you are logged in and have provided the patient's full name to proceed.",
                type: "warning"
            });
            return;
        }
        setShowPayment(true);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const payload = {
                appointment_id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                doctor_id: selectedSlot.doctor_id,
                doctor_name: selectedSlot.doctor_name,
                doctor_email: selectedSlot.doctor_email || "doctor@example.com",
                patient_name: patientName,
                patient_email: user.email || "patient@example.com",
                date: date,
                time: selectedSlot.time,
                department: selectedSlot.department || analysis?.department,
                triage_priority: analysis?.triage_priority,
                estimated_duration_minutes: analysis?.estimated_duration_minutes,
                symptoms: analysis?.symptoms,
                consultation_fee: selectedSlot.price_per_hour || 150,
                payment_status: "paid"
            };

            await scheduleAppointment(payload);
            setShowPayment(false);
            setBookingStatus('success');
        } catch (error) {
            console.error("Booking failed", error);
            setAlertConfig({
                isOpen: true,
                title: "Gateway Connection Error",
                message: "We were unable to verify your payment. Please check your card details and try again.",
                type: "danger"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (bookingStatus === 'success') {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="glass-card" 
                style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '4rem 3rem', borderRadius: '40px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4 }} />
                
                <motion.div 
                    initial={{ scale: 0, rotate: -45 }} 
                    animate={{ scale: 1, rotate: 0 }} 
                    transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }} 
                    style={{ width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 2.5rem' }}
                >
                    <CheckCircle2 size={56} />
                </motion.div>

                <h2 style={{ fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-1px' }}>Confirmed!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.7', fontWeight: 500 }}>
                    Your clinical session with <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Dr. {selectedSlot?.doctor_name}</span> has been successfully scheduled and secured.
                </p>

                <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)', textAlign: 'left', marginBottom: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <p style={labelStyle}>Date & Time</p>
                            <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--primary)', fontSize: '1.1rem' }}>{selectedSlot?.time}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={labelStyle}>Status</p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800 }}>
                                <ShieldCheck size={18} /> SECURE
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <motion.button 
                        whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} 
                        onClick={() => navigate('/patient-dashboard')} 
                        className="btn-primary" 
                        style={{ padding: '1.25rem', borderRadius: '20px', fontSize: '1.05rem', boxShadow: 'var(--shadow-lg)' }}
                    >
                        Go to Dashboard
                    </motion.button>
                    <motion.button 
                        whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} 
                        onClick={() => window.print()} 
                        className="btn-secondary" 
                        style={{ padding: '1.25rem', borderRadius: '20px', fontSize: '1.05rem' }}
                    >
                        Save Ticket
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '4rem', borderRadius: '40px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-1.5px' }}>Book Appointment</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>Select your preferred schedule for clinical consultation and biometric screening.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
                    <div style={{ background: 'var(--bg-color)', padding: '0.75rem 2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
                        <Calendar size={20} style={{ color: 'var(--primary)' }} />
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700, outline: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }} 
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                            <RefreshCw size={40} style={{ color: 'var(--primary)', opacity: 0.6 }} />
                        </motion.div>
                        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Analyzing physician availability...</p>
                    </div>
                ) : slots.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-color)', borderRadius: '32px', border: '1px dashed var(--border-subtle)' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 1.5rem' }}>
                            <Calendar size={32} />
                        </div>
                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>No Slots Available</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>Dr. specialists are unavailable on this date. Please select another day.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                        <AnimatePresence>
                            {slots.map((slot, idx) => {
                                const isSelected = selectedSlot?.id === slot.id;
                                return (
                                    <motion.div 
                                        key={slot.id} 
                                        initial={{ opacity: 0, scale: 0.9 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        transition={{ delay: idx * 0.03 }} 
                                        onClick={() => setSelectedSlot(slot)} 
                                        whileHover={{ y: -8, scale: 1.02 }} 
                                        whileTap={{ scale: 0.98 }} 
                                        style={{ 
                                            padding: '2rem 1.5rem', 
                                            borderRadius: '28px', 
                                            border: '1px solid', 
                                            borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)', 
                                            background: isSelected ? 'var(--primary)' : 'white', 
                                            cursor: 'pointer', 
                                            textAlign: 'center', 
                                            transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', 
                                            boxShadow: isSelected ? '0 20px 40px -10px rgba(99, 102, 241, 0.3)' : 'var(--shadow-sm)',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isSelected ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                                            {slot.time}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>Dr. {slot.doctor_name.split(' ').pop()}</div>
                                        {isSelected && <motion.div layoutId="check" style={{ position: 'absolute', top: '15px', right: '15px', color: 'white' }}><CheckCircle2 size={18} /></motion.div>}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                <AnimatePresence>
                    {selectedSlot && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '3rem', marginTop: '1rem' }}>
                                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                                    <p style={labelStyle}>Patient Verification</p>
                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Enter Patient Full Name" 
                                            value={patientName} 
                                            onChange={(e) => setPatientName(e.target.value)} 
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <motion.button 
                                        whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}
                                        onClick={initiateBooking} 
                                        disabled={!patientName} 
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-lg)' }}
                                    >
                                        <Lock size={20} /> Secure Checkout (₹{selectedSlot.price_per_hour || 150})
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showPayment && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}>
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="glass-card" style={{ background: 'white', borderRadius: '40px', width: '100%', maxWidth: '480px', padding: '3.5rem', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'var(--primary-glow)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: 'var(--text-main)' }}>Payment</h3>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>256-bit Secure Gateway</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowPayment(false)} style={{ background: 'var(--bg-color)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.6rem', borderRadius: '50%' }}><X size={20} /></button>
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Consulation Total</p>
                                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-2px', fontFamily: 'Outfit, sans-serif' }}>
                                        <span style={{ fontSize: '1.5rem', verticalAlign: 'super', color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>{selectedSlot.price_per_hour || 150}.00
                                    </div>
                                </div>

                                <form onSubmit={handlePayment}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <p style={labelStyle}>Card Particulars</p>
                                        <input required placeholder="Card Number" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })} style={{ ...inputStyle, marginBottom: '0.75rem' }} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <input required placeholder="MM / YY" value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} style={inputStyle} />
                                            <input required placeholder="CVC" value={cardDetails.cvc} onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '3rem' }}>
                                        <p style={labelStyle}>Cardholder Name</p>
                                        <input required placeholder="Full Name" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })} style={inputStyle} />
                                    </div>
                                    <motion.button 
                                        type="submit" 
                                        disabled={isProcessing} 
                                        whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-lg)' }}
                                    >
                                        {isProcessing ? <RefreshCw size={20} style={{ animation: 'spin 1.5s linear infinite' }} /> : <ShieldCheck size={20} />}
                                        {isProcessing ? 'Verifying...' : 'Complete Payment'}
                                    </motion.button>
                                </form>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <Star size={14} fill="#fbbf24" stroke="none" /> Trusted by 10k+ patients
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
            </motion.div>
        </div>
    );
};

export default BookingFlow;
