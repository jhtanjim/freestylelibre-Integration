import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [ConfigModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],   // ← GlucoseModule imports this
})
export class AuthModule { }