import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { UserService } from '../user/user.service';
import { Volunteer } from '../entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindVolunteerDto } from './dto/find-volunteer.dto';
import { ActivityCategoryService } from '../activity-category/activity-category.service';

@Injectable()
export class VolunteerService {
	constructor(
		@InjectRepository(Volunteer)
		private volunteerRepository: Repository<Volunteer>,
		private userService: UserService,
		private activityCategoryService: ActivityCategoryService
	){}

	async create(createVolunteerDto: CreateVolunteerDto, userId: number) {
		const userToAttach = await this.userService.findOneById(userId);
		const volunteer = new Volunteer();
		volunteer.organizationName = createVolunteerDto.organizationName;
		volunteer.user = userToAttach;
		volunteer.validated = false;
		volunteer.isSolo = createVolunteerDto.isSolo;
		volunteer.activities = this.activityCategoryService.convertActivitiesToArray(createVolunteerDto.activities);
		const {user, ...result} = await this.volunteerRepository.save(volunteer);
		return result;
	}

	async find(page: number, params : FindVolunteerDto) {
		let querry = this.volunteerRepository.createQueryBuilder("volunteer")
		.innerJoin("volunteer.activities", "activity_category");
		if(params.organizationName){
			const querryString = `%${params.organizationName}%`;
			querry = querry.andWhere("volunteer.organizationName LIKE :name", {name: querryString});
		}
		if(params.isSolo !== undefined){
			querry = querry.andWhere("volunteer.isSolo = :isSolo", {isSolo: params.isSolo});
		}
		if(params.activities?.length > 0){
			querry = querry.andWhere("activity_category.id IN (:...ids)",{ids: params.activities});
		}
		const volunteers = await querry.skip(page * 10).take(10).getMany();
		return volunteers;
	}

	async findFullVolunteer(id: number) {
		if(!id){
			return null;
		}
		const volunteer = await this.volunteerRepository.findOne({
			where: {
				id: id
			},
			relations: {
				activities: true
			}
		});
		return volunteer;
	}

	async validate(id: number){
		const volunteer = await this.findFullVolunteer(id);
		if(volunteer){
			volunteer.validated = !volunteer.validated;
			await this.volunteerRepository.save(volunteer);
			return volunteer;
		}
		return null;
	}

	async update(id: number, updateVolunteerDto: UpdateVolunteerDto) {
		if(!id){
			return null;
		}
		const volunteer = await this.volunteerRepository.findOne({where:{
			id: id
		}});
		if(volunteer){
			const {activities, ...update} = updateVolunteerDto;
			this.volunteerRepository.merge(volunteer, update);
			if(activities){
				volunteer.activities = this.activityCategoryService.convertActivitiesToArray(activities);
			}
			await this.volunteerRepository.save(volunteer);
			return this.findFullVolunteer(volunteer.id);
		}
		return null;
	}
}
