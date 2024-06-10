import { Injectable } from '@nestjs/common';
import { CreateActivityCategoryDto } from './dto/create-activity-category.dto';
import { UpdateActivityCategoryDto } from './dto/update-activity-category.dto';
import { Repository } from 'typeorm';
import { ActivityCategory } from 'src/entities/activity-category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivityCategoryService {

	constructor(
		@InjectRepository(ActivityCategory)
		private activityRepository: Repository<ActivityCategory>
	) {}

	async create(createActivityCategoryDto: CreateActivityCategoryDto) {
		const activity = new ActivityCategory();
		activity.name = createActivityCategoryDto.name;
		return await this.activityRepository.save(activity);
	}

	findAll() {
		return this.activityRepository.find();
	}

	async update(id: number, updateActivityCategoryDto: UpdateActivityCategoryDto) {
		if(!id){return null;}
		const activity = await this.activityRepository.findOne({
			where: {id:id}
		});
		activity.name = updateActivityCategoryDto.name;
		this.activityRepository.save(activity);
		return activity;
	}

	remove(id: number) {
		return this.activityRepository.delete(id);
	}
}
