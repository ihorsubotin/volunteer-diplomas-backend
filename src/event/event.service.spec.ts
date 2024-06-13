import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { ActivityCategoryModule } from '../activity-category/activity-category.module';

describe('EventService', () => {
	let service: EventService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [TypeOrmModule.forFeature([Event]), ActivityCategoryModule],
			controllers: [EventController],
			providers: [EventService],
		}).compile();

		service = module.get<EventService>(EventService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
