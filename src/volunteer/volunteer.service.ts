import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { UserService } from 'src/user/user.service';
import { Volunteer } from 'src/entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, FindManyOptions, In, Repository } from 'typeorm';
import { FindVolunteerDto } from './dto/find-volunteer.dto';
import { ActivityCategoryService } from 'src/activity-category/activity-category.service';
import { ActivityCategory } from 'src/entities/activity-category.entity';

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
		volunteer.activities = createVolunteerDto.activities.map(id=>{
			const ac = new ActivityCategory();
			ac.id = id;
			return ac;
		});
		const {user, ...result} = await this.volunteerRepository.save(volunteer);
		return result;
	}

	async find(page: number, params : FindVolunteerDto) {
		let querry = this.volunteerRepository.createQueryBuilder("volunteer")
		.innerJoin("volunteer.activities", "activity_category");
		if(params.isSolo){
			querry = querry.where("volunteer.isSolo = :isSolo", {isSolo: params.isSolo});
		}
		if(params.activities?.length > 0){
			querry = querry.where("activity_category.id IN (:...ids)",{ids: params.activities});
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
				volunteer.activities = activities.map((id: number)=>{
					const ac = new ActivityCategory();
					ac.id = id;
					return ac;
				});
			}
			await this.volunteerRepository.save(volunteer);
			return this.findFullVolunteer(volunteer.id);
		}
		return null;
	}
}
