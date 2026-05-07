import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /auth/login
     * Authenticates with LibreLink and returns user profile
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { email: string; password: string }) {
        const { user } = await this.authService.login(body.email, body.password);
        return { success: true, data: user };
    }

    /**
     * GET /auth/me
     * Returns the currently authenticated user's profile
     */
    @Get('me')
    async getMe() {
        const user = await this.authService.getMe();
        return { success: true, data: user };
    }

    /**
     * POST /auth/reset-session
     * Forces re-authentication on next request
     */
    @Post('reset-session')
    @HttpCode(HttpStatus.OK)
    resetSession() {
        this.authService.resetSession();
        return { success: true, message: 'Session cleared. Will re-authenticate on next request.' };
    }
}