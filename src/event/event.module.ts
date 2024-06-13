import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { ActivityCategoryModule } from '../activity-category/activity-category.module';

@Module({
	imports: [TypeOrmModule.forFeature([Event]), ActivityCategoryModule],
	controllers: [EventController],
	providers: [EventService],
})
export class EventModule { }
