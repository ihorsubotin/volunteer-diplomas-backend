import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch } from '@nestjs/common';
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
		return await this.activityCategoryService.update(+id, updateActivityCategoryDto);
	}

	@UseGuards(IsAdmin)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return await this.activityCategoryService.remove(+id);
	}
}
