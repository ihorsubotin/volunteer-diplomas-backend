import { Module } from '@nestjs/common';
import { ActivityCategoryService } from './activity-category.service';
import { ActivityCategoryController } from './activity-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCategory } from 'src/entities/activity-category.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ActivityCategory])],
	controllers: [ActivityCategoryController],
	providers: [ActivityCategoryService],
})
export class ActivityCategoryModule {}
