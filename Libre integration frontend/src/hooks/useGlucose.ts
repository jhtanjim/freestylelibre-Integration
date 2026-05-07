import { useCallback, useState } from 'react';
import api from '../api/client';
import type { GlucoseData } from '../types/glucose';

export function useGlucose() {
    const [data, setData] = useState<GlucoseData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<{ success: boolean; data: GlucoseData }>('/glucose');
            if (res.data.success) {
                setData(res.data.data);
                setLastRefresh(new Date());
            }
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Failed to fetch glucose data');
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, lastRefresh, refresh };
}