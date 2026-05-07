import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

export interface GlucoseReading {
    value: number;
    mmol: string;
    timestamp: Date;
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

@Injectable()
export class GlucoseService {
    private readonly logger = new Logger(GlucoseService.name);

    constructor(private readonly authService: AuthService) { }

    private mapReading(r: any): GlucoseReading {
        return {
            value: r.value ?? r.mgDl ?? 0,
            mmol: r.mmol ?? ((r.value ?? 0) / 18).toFixed(1),
            timestamp: r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp),
            trend: r.trend ?? 3,
            trendType: r.trendType ?? 'Flat',
            isHigh: r.isHigh ?? false,
            isLow: r.isLow ?? false,
        };
    }

    /**
     * GET /glucose — full data (current + history)
     */
    async getGlucoseData(): Promise<GlucoseData> {
        const client = await this.authService.getClient();

        try {
            const [current, historyList] = await Promise.all([
                client.read().catch(() => null),
                client.history().catch(() => []),
            ]);

            return {
                current: current ? this.mapReading(current) : null,
                history: Array.isArray(historyList)
                    ? historyList.map((r: any) => this.mapReading(r))
                    : [],
                fetchedAt: new Date().toISOString(),
            };
        } catch (error: any) {
            this.logger.error('Failed to fetch glucose data: ' + error?.message);
            const msg = (error?.message ?? '').toLowerCase();

            if (msg.includes('session') || msg.includes('token') || msg.includes('401')) {
                this.authService.invalidateSession();
            }

            throw new ServiceUnavailableException(
                `Failed to fetch glucose data: ${error?.message ?? 'Unknown error'}`,
            );
        }
    }
    // get raw data

    // async getGlucoseData(): Promise<GlucoseData> {
    //     return {
    //         current: {
    //             value: 120,
    //             mmol: (120 / 18).toFixed(1),
    //             timestamp: new Date(),
    //             trend: 2,
    //             trendType: 'Rising',
    //             isHigh: false,
    //             isLow: false,
    //         },
    //         history: [
    //             {
    //                 value: 110,
    //                 mmol: (110 / 18).toFixed(1),
    //                 timestamp: new Date(Date.now() - 60000),
    //                 trend: 1,
    //                 trendType: 'Flat',
    //                 isHigh: false,
    //                 isLow: false,
    //             },
    //         ],
    //         fetchedAt: new Date().toISOString(),
    //     };
    // }
    /**
     * GET /glucose/current — latest reading only
     */
    async getCurrentReading(): Promise<GlucoseReading | null> {
        const data = await this.getGlucoseData();
        return data.current;
    }

    /**
     * GET /glucose/history — historical readings only
     */
    async getHistory(): Promise<GlucoseReading[]> {
        const data = await this.getGlucoseData();
        return data.history;
    }
}