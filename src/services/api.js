import { auth } from '../firebase';

const API_BASE_URL = "http://localhost:8000";

/**
 * Helper function to inject Firebase Auth tokens into requests
 */
const fetchWithAuth = async (endpoint, options = {}) => {
    let token = null;
    if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
    }

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error(`API Error on ${endpoint}:`, errData);
        throw new Error(errData.detail || 'API Request Failed');
    }
    return response.json();
};

// --- Original ML Endpoint ---
export const analyzeSymptoms = async (symptoms) => {
    return fetchWithAuth('/analyze-symptoms', {
        method: "POST",
        body: JSON.stringify({ symptoms }),
    });
};

// --- Users API ---
export const getUsers = async () => {
    return fetchWithAuth('/api/users');
};

export const getDoctors = async () => {
    const response = await fetch(`${API_BASE_URL}/api/doctors`);
    if (!response.ok) {
        throw new Error('Failed to fetch doctors');
    }
    return response.json();
};

export const updateUserRole = async (userId, role) => {
    return fetchWithAuth(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });
};

export const updateScheduleSettings = async (userId, settings) => {
    return fetchWithAuth(`/api/users/${userId}/schedule`, {
        method: "PATCH",
        body: JSON.stringify(settings),
    });
};

export const deleteUser = async (userId) => {
    return fetchWithAuth(`/api/users/${userId}`, {
        method: "DELETE"
    });
};

// --- Appointments API ---
export const getAppointments = async () => {
    return fetchWithAuth('/api/appointments');
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    return fetchWithAuth(`/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
};

export const scheduleAppointment = async (appointmentData) => {
    return fetchWithAuth('/api/schedule-appointment', {
        method: "POST",
        body: JSON.stringify(appointmentData),
    });
};

// --- Chats API ---
export const getChats = async () => {
    return fetchWithAuth('/api/chats');
};

export const createChatMessage = async (chatId, text) => {
    return fetchWithAuth(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text, sender_id: auth.currentUser?.uid || '' }),
    });
};

export const sendMessage = async (chatId, text) => {
    return createChatMessage(chatId, text);
};
