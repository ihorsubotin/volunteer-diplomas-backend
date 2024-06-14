import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramUpdate } from '../entities/telegram-update.entity'
import { ConfigModule } from '@nestjs/config';
import { BrowserUpdate } from 'src/entities/browser-update.entity';
import { TelegramService } from 'src/telegram/telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramUpdate, BrowserUpdate]), TelegramService],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule {}
