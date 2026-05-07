import { Controller, Get } from '@nestjs/common';
import { GlucoseService } from './glucose.service';

@Controller('glucose')
export class GlucoseController {
    constructor(private readonly glucoseService: GlucoseService) { }

    /** GET /glucose */
    @Get()
    async getAll() {
        const data = await this.glucoseService.getGlucoseData();
        return { success: true, data };
    }

    /** GET /glucose/current */
    @Get('current')
    async getCurrent() {
        const data = await this.glucoseService.getCurrentReading();
        return { success: true, data, fetchedAt: new Date().toISOString() };
    }

    /** GET /glucose/history */
    @Get('history')
    async getHistory() {
        const data = await this.glucoseService.getHistory();
        return { success: true, data, fetchedAt: new Date().toISOString() };
    }
}