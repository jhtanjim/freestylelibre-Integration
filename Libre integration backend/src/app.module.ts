import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlucoseModule } from './glucose/glucose.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes .env available everywhere without re-importing
    }),
    GlucoseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }