const API_BASE_URL = "http://localhost:8000";

export const analyzeSymptoms = async (symptoms) => {
    const response = await fetch(`${API_BASE_URL}/analyze-symptoms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
    });
    return response.json();
};
