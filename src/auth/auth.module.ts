import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule, DbModule],
  providers: [AuthService],
})
export class AuthModule {}
