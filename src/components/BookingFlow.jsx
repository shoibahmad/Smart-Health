import React, { useState, useEffect } from 'react';

import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const generateTimeSlots = (doctor) => {
    // Generate some mock time slots for the real doctor
    const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"];
    return times.map((time, i) => ({
        id: `${doctor.id}-${i}`,
        time,
        doctor_id: doctor.id,
        doctor_name: doctor.full_name || 'Dr. Unknown',
        doctor_email: doctor.email || '',
        department: doctor.profile?.specialization || 'General',
        is_available: Math.random() > 0.3 // Simulate some booked slots
    })).filter(s => s.is_available);
};

const BookingFlow = ({ department }) => {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [patientName, setPatientName] = useState(user?.full_name || '');
    const [bookingStatus, setBookingStatus] = useState(null); // 'success' or null

    const fetchSlots = async () => {
        setLoading(true);
        try {
            // Find doctors matching the department
            const q = query(collection(db, "users"), where("role", "==", "doctor"));
            const docSnap = await getDocs(q);
            const allDoctors = docSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            // Filter by department if provided
            let matchedDoctors = allDoctors;
            if (department) {
                matchedDoctors = allDoctors.filter(d =>
                    d.profile?.specialization?.toLowerCase() === department.toLowerCase()
                );
                // Fallback to all doctors if none specific match
                if (matchedDoctors.length === 0) matchedDoctors = allDoctors;
            }

            // If still no doctors, just use a dummy fallback
            if (matchedDoctors.length === 0) {
                matchedDoctors = [{ id: 'dummy-1', full_name: 'Dr. System', email: 'doctor@example.com', profile: { specialization: department } }];
            }

            // Generate slots for up to 3 doctors
            let allSlots = [];
            matchedDoctors.slice(0, 3).forEach(doc => {
                allSlots = [...allSlots, ...generateTimeSlots(doc)];
            });

            // Sort by time
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
    }, [date, department]);

    const handleBook = async () => {
        if (!selectedSlot || !patientName || !user) {
            alert("Please ensure you are logged in and have entered a name.");
            return;
        }

        try {
            const appointmentData = {
                doctor_id: selectedSlot.doctor_id,
                doctor_name: selectedSlot.doctor_name,
                patient_id: user.uid || user.id,
                patient_name: patientName,
                patient_email: user.email || '',
                date: date,
                time: selectedSlot.time,
                department: selectedSlot.department || department,
                status: 'scheduled',
                created_at: serverTimestamp(),
                symptoms_summary: "User completed AI checkup for this booking."
            };

            // 1. Save to Firestore
            const docRef = await addDoc(collection(db, "appointments"), appointmentData);

            // 2. Call Python Backend to schedule email/calendar triggers
            try {
                // Ensure date and time are clean strings for datetime parsing in Python
                const payload = {
                    appointment_id: docRef.id,
                    doctor_name: selectedSlot.doctor_name,
                    doctor_email: selectedSlot.doctor_email || "doctor@example.com",
                    patient_name: patientName,
                    patient_email: user.email || "patient@example.com",
                    date: date, // YYYY-MM-DD
                    time: selectedSlot.time, // HH:MM
                    department: selectedSlot.department || department
                };

                await fetch('http://localhost:8000/api/schedule-appointment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (backendErr) {
                console.warn("Backend scheduling failed, but appointment was created in DB:", backendErr);
            }

            setBookingStatus('success');
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to book appointment. Please try again.");
        }
    };

    if (bookingStatus === 'success') {
        return (
            <div className="glass-card fade-in" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h2>Appointment Confirmed!</h2>
                <p>You are booked with <strong>{selectedSlot?.doctor_name}</strong> on <strong>{date}</strong> at <strong>{selectedSlot?.time}</strong>.</p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <small style={{ color: 'var(--text-muted)' }}>We've emailed a Google Calendar invitation to both you and the doctor.</small>
                </div>
                <button
                    onClick={() => {
                        setBookingStatus(null);
                        setPatientName('');
                        setSelectedSlot(null);
                    }}
                    style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Book Another
                </button>
            </div>
        )
    }

    return (
        <div className="glass-card fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Select an Appointment</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                        maxWidth: '200px',
                        margin: 0,
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        borderRadius: '8px'
                    }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading available slots...</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    {slots.map(slot => (
                        <div
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                border: selectedSlot?.id === slot.id ? '2px solid #8b5cf6' : '1px solid var(--glass-border)',
                                background: selectedSlot?.id === slot.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                                transform: selectedSlot?.id === slot.id ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{slot.time}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{slot.doctor_name.split(' ').pop()}</div>
                        </div>
                    ))}
                </div>
            )}

            {selectedSlot && (
                <div className="fade-in" style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '1.5rem',
                    marginTop: '1rem'
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>Finalize Booking</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Patient Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                borderRadius: '8px'
                            }}
                        />
                    </div>
                    <button
                        onClick={handleBook}
                        disabled={!patientName}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: patientName ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'gray',
                            border: 'none',
                            borderRadius: '10px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: patientName ? 'pointer' : 'not-allowed',
                            fontSize: '1rem'
                        }}
                    >
                        Confirm Booking with {selectedSlot.doctor_name}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingFlow;
