import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { ActivityCategoryModule } from '../activity-category/activity-category.module';
import { UpdateModule } from 'src/update/update.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [TypeOrmModule.forFeature([Event]), ActivityCategoryModule, UpdateModule, TelegramModule, ConfigModule],
	controllers: [EventController],
	providers: [EventService],
})
export class EventModule { }
