import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const { LibreLinkClient } = require('libre-link-unofficial-api');

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

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private client: any = null;
    private isLoggedIn = false;

    constructor(private readonly configService: ConfigService) { }

    async login(email: string, password: string): Promise<{ client: any; user: UserProfile }> {
        try {
            const client = new LibreLinkClient({
                email,
                password,
                lluVersion: '4.16.0',
                region: 'us',
            });

            await client.login();
            this.client = client;
            this.isLoggedIn = true;

            const me = client.me ?? {};
            const user: UserProfile = {
                id: me.id ?? null,
                firstName: me.firstName ?? null,
                lastName: me.lastName ?? null,
                email: me.email ?? email,
                country: me.country ?? null,
                accountType: me.accountType ?? null,
                created: me.created ?? null,
                lastLogin: me.lastLogin ?? null,
                dateOfBirth: me.dateOfBirth ?? null,
                uiLanguage: me.uiLanguage ?? null,
            };

            return { client, user };
        } catch (error: any) {
            this.isLoggedIn = false;
            this.client = null;
            const msg = (error?.message ?? '').toLowerCase();

            if (msg.includes('invalid') || msg.includes('unauthorized') || msg.includes('status 2')) {
                throw new UnauthorizedException('Invalid email or password.');
            }

            throw error;
        }
    }

    async getClient(): Promise<any> {
        if (this.client && this.isLoggedIn) return this.client;

        const email = this.configService.get<string>('LIBRE_LINK_EMAIL');
        const password = this.configService.get<string>('LIBRE_LINK_PASSWORD');

        if (!email || !password) {
            throw new Error('LIBRE_LINK_EMAIL and LIBRE_LINK_PASSWORD must be set in .env');
        }

        const { client } = await this.login(email, password);
        return client;
    }

    async getMe(): Promise<UserProfile> {
        const client = await this.getClient();
        const me = client.me ?? {};
        return {
            id: me.id ?? null,
            firstName: me.firstName ?? null,
            lastName: me.lastName ?? null,
            email: me.email ?? null,
            country: me.country ?? null,
            accountType: me.accountType ?? null,
            created: me.created ?? null,
            lastLogin: me.lastLogin ?? null,
            dateOfBirth: me.dateOfBirth ?? null,
            uiLanguage: me.uiLanguage ?? null,
        };
    }

    resetSession(): void {
        this.client = null;
        this.isLoggedIn = false;
        this.logger.log('Session reset');
    }

    invalidateSession(): void {
        this.isLoggedIn = false;
        this.client = null;
    }
}