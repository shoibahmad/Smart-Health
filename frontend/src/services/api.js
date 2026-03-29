import { auth } from '../firebase';

const API_BASE_URL = "http://localhost:8000";

const fetchWithAuth = async (endpoint, options = {}) => {
    let token = null;
    if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...options, headers };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error(`API Error on ${endpoint}:`, errData);
        throw new Error(errData.detail || 'API Request Failed');
    }
    return response.json();
};

// --- ML Symptom Analysis ---
export const analyzeSymptoms = async (data) => {
    return fetchWithAuth('/analyze-symptoms', {
        method: "POST",
        body: JSON.stringify(data),
    });
};

// --- Users API ---
export const getUsers = async () => fetchWithAuth('/api/users');

export const getDoctors = async () => {
    const response = await fetch(`${API_BASE_URL}/api/doctors`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return response.json();
};

export const updateUserRole = async (userId, role) =>
    fetchWithAuth(`/api/users/${userId}/role`, { method: "PATCH", body: JSON.stringify({ role }) });

export const updateScheduleSettings = async (userId, settings) =>
    fetchWithAuth(`/api/users/${userId}/schedule`, { method: "PATCH", body: JSON.stringify(settings) });

export const deleteUser = async (userId) =>
    fetchWithAuth(`/api/users/${userId}`, { method: "DELETE" });

export const updateUserProfile = async (userId, data) =>
    fetchWithAuth(`/api/profiles/${userId}`, { method: "PATCH", body: JSON.stringify(data) });

// --- Appointments API ---
export const getAppointments = async () => fetchWithAuth('/api/appointments');

export const updateAppointmentStatus = async (appointmentId, status) =>
    fetchWithAuth(`/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

export const bulkUpdateAppointmentStatus = async (appointmentIds, status) =>
    fetchWithAuth('/api/appointments/bulk-status', {
        method: "POST",
        body: JSON.stringify({ appointment_ids: appointmentIds, status }),
    });

export const requestReschedule = async (appointmentId, newDate, newTime, reason = '') =>
    fetchWithAuth(`/api/appointments/${appointmentId}/reschedule`, {
        method: "POST",
        body: JSON.stringify({ appointment_id: appointmentId, new_date: newDate, new_time: newTime, reason }),
    });

export const approveReschedule = async (appointmentId) =>
    fetchWithAuth(`/api/appointments/${appointmentId}/reschedule/approve`, { method: "PATCH" });

export const updateAppointmentPayment = async (appointmentId, paymentStatus, consultationFee = null) =>
    fetchWithAuth(`/api/appointments/${appointmentId}/payment`, {
        method: "PATCH",
        body: JSON.stringify({ payment_status: paymentStatus, consultation_fee: consultationFee }),
    });

export const scheduleAppointment = async (appointmentData) =>
    fetchWithAuth('/api/schedule-appointment', { method: "POST", body: JSON.stringify(appointmentData) });

// --- Prescriptions API ---
export const getPrescriptions = async () => fetchWithAuth('/api/prescriptions');

export const getPrescription = async (id) => fetchWithAuth(`/api/prescriptions/${id}`);

export const createPrescription = async (data) =>
    fetchWithAuth('/api/prescriptions', { method: "POST", body: JSON.stringify(data) });

// --- Consultation Notes API ---
export const getNotes = async (patientId = null) => {
    const query = patientId ? `?patient_id=${patientId}` : '';
    return fetchWithAuth(`/api/notes${query}`);
};

export const createNote = async (data) =>
    fetchWithAuth('/api/notes', { method: "POST", body: JSON.stringify(data) });

// --- Referrals API ---
export const getReferrals = async () => fetchWithAuth('/api/referrals');

export const createReferral = async (data) =>
    fetchWithAuth('/api/referrals', { method: "POST", body: JSON.stringify(data) });

// --- Audit Logs ---
export const getAuditLogs = async (limit = 100) =>
    fetchWithAuth(`/api/audit-logs?limit=${limit}`);

// --- Analytics ---
export const getAnalyticsOverview = async () => fetchWithAuth('/api/analytics/overview');
export const getRevenueAnalytics = async () => fetchWithAuth('/api/analytics/revenue');
export const getDoctorPerformance = async () => fetchWithAuth('/api/analytics/doctor-performance');

// --- ML Endpoints ---
export const getNoshowRisks = async () => fetchWithAuth('/api/ml/noshow-risks');
export const recommendDoctors = async (symptoms) =>
    fetchWithAuth('/api/ml/recommend-doctors', { method: "POST", body: JSON.stringify({ symptoms }) });

// --- Chats API ---
export const getChats = async () => fetchWithAuth('/api/chats');

export const createChatMessage = async (chatId, text) =>
    fetchWithAuth(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text, sender_id: auth.currentUser?.uid || '' }),
    });

export const sendMessage = async (chatId, text) => createChatMessage(chatId, text);

// --- Gemini AI ---
export const summarizeNotesGemini = async (rawNotes) =>
    fetchWithAuth('/api/gemini/summarize-notes', {
        method: "POST",
        body: JSON.stringify({ raw_notes: rawNotes })
    });

export const logVitals = async (data) =>
    fetchWithAuth('/api/vitals', { method: "POST", body: JSON.stringify(data) });

export const getVitals = async () => fetchWithAuth('/api/vitals');

export const summarizeReportPdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    let token = null;
    if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
    }
    
    const response = await fetch(`${API_BASE_URL}/api/summarize-report-pdf`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to summarize report');
    }
    return response.json();
};

export const leaveReview = async (appointmentId, data) =>
    fetchWithAuth(`/api/appointments/${appointmentId}/review`, {
        method: "POST",
        body: JSON.stringify(data),
    });
