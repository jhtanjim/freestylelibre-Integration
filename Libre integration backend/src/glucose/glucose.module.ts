import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GlucoseController } from './glucose.controller';
import { GlucoseService } from './glucose.service';

@Module({
    imports: [AuthModule],   // ← provides AuthService
    controllers: [GlucoseController],
    providers: [GlucoseService],
    exports: [GlucoseService],
})
export class GlucoseModule { }