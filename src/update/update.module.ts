import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramUpdate } from '../entities/telegram-update.entity'
import { BrowserUpdate } from 'src/entities/browser-update.entity';
import { TelegramModule } from 'src/telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramUpdate, BrowserUpdate]), TelegramModule, ConfigModule],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule {}
