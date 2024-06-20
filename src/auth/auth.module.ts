import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { IsAdmin } from './guards/admin.guard';
import { IsLoggedIn } from './guards/loggedIn.guard';
import { IsTelegram } from './guards/telegram.guard';
import { IsVolunteer } from './guards/volunteer.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [AuthService, IsAdmin, IsLoggedIn, IsTelegram, IsVolunteer],
  controllers: [AuthController],
  exports: [IsAdmin, IsLoggedIn, IsTelegram, IsVolunteer]
})
export class AuthModule {}
