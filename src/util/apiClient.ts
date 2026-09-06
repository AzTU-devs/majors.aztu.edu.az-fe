import axios from 'axios';

/**
 * Base URL of the majors API.
 *
 * Override per environment with NEXT_PUBLIC_API_BASE_URL (e.g. point it at
 * http://127.0.0.1:8000 for local development). The production host is the
 * fallback so a missing env var never breaks a deploy.
 */
export const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-majors.aztu.edu.az'
).replace(/\/$/, '');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // Without a timeout a stalled request leaves the UI spinning forever.
    timeout: 20000,
    headers: { Accept: 'application/json' },
});

export default apiClient;
