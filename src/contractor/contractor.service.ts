import { Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { Repository } from 'typeorm';
import { Contractor } from 'src/entities/contractor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityCategoryService } from 'src/activity-category/activity-category.service';

@Injectable()
export class ContractorService {
	constructor(
		@InjectRepository(Contractor)
		private contractorRepository: Repository<Contractor>,
		private activtyCategoryService: ActivityCategoryService
	){}

	async create(createContractorDto: CreateContractorDto, user) {
		const contractor = new Contractor();
		contractor.activities = this.activtyCategoryService.convertActivitiesToArray(createContractorDto.activities);
		contractor.user = user;
		return await this.contractorRepository.save(contractor);
	}

	async findContractorsByActivities(activities: number[]) {
		let querry = this.contractorRepository.createQueryBuilder("contractor")
		.innerJoin("contractor.activities", "activity_category")
		.where("activity_category.id IN (:...ids)",{ids: activities}).getMany();
		return querry;
	}

	async findFullContractor(id: number) {
		const contructor = this.contractorRepository.findOne({
			where: {id: id}, 
			relations:{ activities: true}
		});
		if(!contructor){
			return null;
		}
		return contructor;
	}

	async update(id: number, updateContractorDto: UpdateContractorDto) {
		const contractor = await this.contractorRepository.findOne({
			where: {id: id}			
		})
		if(!contractor){
			return null;
		}
		contractor.activities = this.activtyCategoryService.convertActivitiesToArray(updateContractorDto.activities);
		return this.contractorRepository.save(contractor);
	}
}
