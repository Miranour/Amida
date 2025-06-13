const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
    // Auth endpoints
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    
    // Institution endpoints
    institutions: `${API_BASE_URL}/institutions`,
    
    // Appointment endpoints
    appointments: `${API_BASE_URL}/appointments`,
    
    // Service endpoints
    services: `${API_BASE_URL}/services`,
    
    // Employee endpoints
    employees: `${API_BASE_URL}/employees`,
};

export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error('API isteği başarısız oldu');
    }

    return response.json();
}; 