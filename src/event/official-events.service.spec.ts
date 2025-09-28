import { Test, TestingModule } from '@nestjs/testing';
import { OfficialEventsService } from './official-events.service';

describe('OfficialEventsService', () => {
	let service: OfficialEventsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OfficialEventsService],
		}).compile();

		service = module.get<OfficialEventsService>(OfficialEventsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
