import { Test, TestingModule } from '@nestjs/testing';
import { ActivityCategoryService } from './activity-category.service';

describe('ActivityCategoryService', () => {
  let service: ActivityCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityCategoryService],
    }).compile();

    service = module.get<ActivityCategoryService>(ActivityCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
