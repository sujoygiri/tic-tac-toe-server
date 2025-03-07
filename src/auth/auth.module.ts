import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule],
  providers: [AuthService],
})
export class AuthModule {}
