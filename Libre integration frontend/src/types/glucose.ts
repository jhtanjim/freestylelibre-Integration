export interface GlucoseReading {
    value: number;
    mmol: string;
    timestamp: string;
    trend: number;
    trendType: string;
    isHigh: boolean;
    isLow: boolean;
}

export interface GlucoseData {
    current: GlucoseReading | null;
    history: GlucoseReading[];
    fetchedAt: string;
}

export interface UserProfile {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    country: string | null;
    accountType: string | null;
    created: string | null;
    lastLogin: string | null;
    dateOfBirth: string | null;
    uiLanguage: string | null;
}

export interface LoginResponse {
    success: boolean;
    data: UserProfile;
}