import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, NotFoundException } from '@nestjs/common';
import { ActivityCategoryService } from './activity-category.service';
import { CreateActivityCategoryDto } from './dto/create-activity-category.dto';
import { UpdateActivityCategoryDto } from './dto/update-activity-category.dto';
import { IsAdmin } from 'src/auth/guards/admin.guard';

@Controller('activity-category')
export class ActivityCategoryController {
	constructor(private readonly activityCategoryService: ActivityCategoryService) { }

	@UseGuards(IsAdmin)
	@Post()
	async create(@Body() createActivityCategoryDto: CreateActivityCategoryDto) {
		return await this.activityCategoryService.create(createActivityCategoryDto);
	}

	@Get()
	async findAll() {
		return await this.activityCategoryService.findAll();
	}

	@UseGuards(IsAdmin)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateActivityCategoryDto: UpdateActivityCategoryDto) {
		const activity = await this.activityCategoryService.update(+id, updateActivityCategoryDto);
		if(!activity){
			throw new NotFoundException('Activity not found');
		}
		return activity;
	}

	@UseGuards(IsAdmin)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		const removed = await this.activityCategoryService.remove(+id);
		if(removed == 0){
			throw new NotFoundException('Activity not found');
		}
		return {entitiesRemoved: removed};
	}
}
