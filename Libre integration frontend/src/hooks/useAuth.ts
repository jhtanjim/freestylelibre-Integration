import { useState } from 'react';
import api from '../api/client';
import { type GlucoseData, type UserProfile } from '../types/glucose';

interface AuthState {
    user: UserProfile | null;
    glucose: GlucoseData | null;
    loading: boolean;
    error: string | null;
}

// Maps backend/network errors → friendly human messages
function friendlyError(err: any): string {
    const status = err?.response?.status;
    const msg = (err?.response?.data?.message ?? err?.message ?? '').toLowerCase();

    if (status === 401 || msg.includes('unauthorized') || msg.includes('invalid') || msg.includes('credentials')) {
        return 'Wrong email or password. Please check and try again.';
    }
    if (status === 429) {
        return 'Too many attempts. Please wait a few minutes and try again.';
    }
    if (status >= 500) {
        return 'LibreLink servers are having issues. Try again in a moment.';
    }
    if (err?.code === 'ECONNREFUSED' || err?.code === 'ERR_NETWORK' || msg.includes('network')) {
        return 'Cannot reach the server. Make sure the backend is running.';
    }
    if (msg.includes('timeout')) {
        return 'Request timed out. Check your internet connection.';
    }
    return 'Something went wrong. Please try again.';
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        glucose: null,
        loading: false,
        error: null,
    });

    const login = async (email: string, password: string) => {
        setState(s => ({ ...s, loading: true, error: null }));
        try {
            const authRes = await api.post<{ success: boolean; data: UserProfile }>(
                '/auth/login', { email, password }
            );
            const glucoseRes = await api.get<{ success: boolean; data: GlucoseData }>('/glucose');

            setState({
                user: authRes.data.data,
                glucose: glucoseRes.data.data,
                loading: false,
                error: null,
            });
            return { user: authRes.data.data, glucose: glucoseRes.data.data };
        } catch (err: any) {
            const message = friendlyError(err);
            setState(s => ({ ...s, loading: false, error: message }));
            throw new Error(message);
        }
    };

    const logout = () => setState({ user: null, glucose: null, loading: false, error: null });

    return { ...state, login, logout };
}