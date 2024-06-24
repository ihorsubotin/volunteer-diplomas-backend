import { Injectable } from '@nestjs/common';
import { CreateActivityCategoryDto } from './dto/create-activity-category.dto';
import { UpdateActivityCategoryDto } from './dto/update-activity-category.dto';
import { Repository } from 'typeorm';
import { ActivityCategory } from '../entities/activity-category.entity';
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
		return this.activityRepository.find({
			order: {name:'ASC'}
		});
	}

	async findActivitiesByArray(activities: number[]){
		const options: any = activities.map(id=>{id: id});
		return await this.activityRepository.findBy(options);
	}
	
	convertActivitiesToArray(activities: number[]){
		return activities.map(id=>{
			const ac = new ActivityCategory();
			ac.id = id;
			return ac;
		});
	}
	
	async update(id: number, updateActivityCategoryDto: UpdateActivityCategoryDto) {
		if(!id){return null;}
		const activity = await this.activityRepository.findOne({
			where: {id:id}
		});
		if(!activity){return null;}
		activity.name = updateActivityCategoryDto.name;
		this.activityRepository.save(activity);
		return activity;
	}

	async remove(id: number) {
		return (await this.activityRepository.delete(id)).affected;
	}
}
