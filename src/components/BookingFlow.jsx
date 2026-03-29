import React, { useState, useEffect } from 'react';

import { getDoctors, scheduleAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const generateTimeSlots = (doctor, selectedDateStr) => {
    const selectedDate = new Date(selectedDateStr);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Default schedule if none provided
    const settings = doctor.schedule_settings || {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '09:00',
        end_time: '17:00'
    };

    if (!settings.days.includes(dayOfWeek)) {
        return []; // Doctor doesn't work this day
    }

    // Generate slots between start_time and end_time every 30 minutes
    const slots = [];
    let currentStr = settings.start_time;
    const endStr = settings.end_time;
    let index = 0;

    while (currentStr < endStr) {
        slots.push({
            id: `${doctor.id}-${index}`,
            time: currentStr,
            doctor_id: doctor.id,
            doctor_name: doctor.full_name || 'Dr. Unknown',
            doctor_email: doctor.email || '',
            department: doctor.profile?.specialization || 'General',
            is_available: Math.random() > 0.2 // Mock availability randomly, ideally should cross-check DB
        });

        // Add 30 mins
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

const BookingFlow = ({ analysis }) => {
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
            const allDoctors = await getDoctors();

            // Filter by department if provided
            const dept = analysis?.department;
            let matchedDoctors = allDoctors;
            if (dept) {
                matchedDoctors = allDoctors.filter(d =>
                    d.profile?.specialization?.toLowerCase() === dept.toLowerCase()
                );
                // Fallback to all doctors if none specific match
                if (matchedDoctors.length === 0) matchedDoctors = allDoctors;
            }

            // If still no doctors, just use a dummy fallback
            if (matchedDoctors.length === 0) {
                matchedDoctors = [{ id: 'dummy-1', full_name: 'Dr. System', email: 'doctor@example.com', profile: { specialization: dept || 'General' } }];
            }

            // Generate slots for up to 3 doctors based on selected date
            let allSlots = [];
            matchedDoctors.slice(0, 3).forEach(doc => {
                allSlots = [...allSlots, ...generateTimeSlots(doc, date)];
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
    }, [date, analysis?.department]);

    const handleBook = async () => {
        if (!selectedSlot || !patientName || !user) {
            alert("Please ensure you are logged in and have entered a name.");
            return;
        }

        try {
            // Schedule the appointment via the backend API
            const payload = {
                appointment_id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate an ID locally or let backend do it
                doctor_name: selectedSlot.doctor_name,
                doctor_email: selectedSlot.doctor_email || "doctor@example.com",
                patient_name: patientName,
                patient_email: user.email || "patient@example.com",
                date: date,
                time: selectedSlot.time,
                department: selectedSlot.department || analysis?.department,
                triage_priority: analysis?.triage_priority,
                estimated_duration_minutes: analysis?.estimated_duration_minutes,
                symptoms: analysis?.symptoms
            };

            await scheduleAppointment(payload);

            setBookingStatus('success');
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to book appointment. Please try again.");
        }
    };

    if (bookingStatus === 'success') {
        return (
            <div className="card fade-in" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '2.5rem 2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
                <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Appointment Confirmed!</h2>
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    You are booked with <strong style={{ color: 'var(--primary)' }}>{selectedSlot?.doctor_name}</strong> on <strong>{date}</strong> at <strong>{selectedSlot?.time}</strong>.
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <small style={{ color: 'var(--text-muted)', display: 'block' }}>We've emailed a Google Calendar invitation to both you and the doctor.</small>
                </div>
                <button
                    onClick={() => {
                        setBookingStatus(null);
                        setPatientName('');
                        setSelectedSlot(null);
                    }}
                    style={{
                        marginTop: '2rem',
                        padding: '0.875rem 2rem',
                        background: 'var(--primary)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    Book Another
                </button>
            </div>
        )
    }

    return (
        <div className="card fade-in" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-main)' }}>Select an Appointment</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', justifyContent: 'center' }}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                        maxWidth: '220px',
                        margin: 0,
                        padding: '0.875rem',
                        background: '#ffffff',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-main)',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>Loading available slots...</p>
                </div>
            ) : slots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>No available slots on this date. Please select another day.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '2.5rem'
                }}>
                    {slots.map(slot => (
                        <div
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            style={{
                                padding: '1.25rem 1rem',
                                borderRadius: '12px',
                                border: selectedSlot?.id === slot.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                background: selectedSlot?.id === slot.id ? 'var(--primary-bg)' : '#ffffff',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                transform: selectedSlot?.id === slot.id ? 'translateY(-2px)' : 'translateY(0)',
                                boxShadow: selectedSlot?.id === slot.id ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                            }}
                        >
                            <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.4rem', color: selectedSlot?.id === slot.id ? 'var(--primary)' : 'var(--text-main)' }}>{slot.time}</div>
                            <div style={{ fontSize: '0.85rem', color: selectedSlot?.id === slot.id ? 'var(--primary)' : 'var(--text-muted)', opacity: selectedSlot?.id === slot.id ? 1 : 0.8 }}>{slot.doctor_name.split(' ').pop()}</div>
                        </div>
                    ))}
                </div>
            )}

            {selectedSlot && (
                <div className="fade-in" style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '2rem',
                    marginTop: '1.5rem'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Finalize Booking</h3>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>Patient Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: '#ffffff',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-main)',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                        />
                    </div>
                    <button
                        onClick={handleBook}
                        disabled={!patientName}
                        style={{
                            width: '100%',
                            padding: '1.1rem',
                            background: patientName ? 'var(--primary)' : '#e2e8f0',
                            border: 'none',
                            borderRadius: '10px',
                            color: patientName ? 'white' : '#94a3b8',
                            fontWeight: 600,
                            cursor: patientName ? 'pointer' : 'not-allowed',
                            fontSize: '1.05rem',
                            transition: 'all 0.2s ease',
                            boxShadow: patientName ? 'var(--shadow-sm)' : 'none'
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
