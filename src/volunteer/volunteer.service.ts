import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { UserService } from 'src/user/user.service';
import { Volunteer } from 'src/entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VolunteerService {
	constructor(
		@InjectRepository(Volunteer)
		private volunteerRepository: Repository<Volunteer>,
		private userService: UserService,
	){}

	async create(createVolunteerDto: CreateVolunteerDto, userId: number) {
		const userToAttach = await this.userService.findOneById(userId);
		const volunteer = new Volunteer();
		volunteer.organizationName = createVolunteerDto.organizationName;
		volunteer.user = userToAttach;
		volunteer.validated = false;
		const {user, ...result} = await this.volunteerRepository.save(volunteer);
		return result;
	}

	findAll() {
		return `This action returns all volunteer`;
	}

	findOne(id: number) {
		return `This action returns a #${id} volunteer`;
	}

	update(id: number, updateVolunteerDto: UpdateVolunteerDto) {
		return `This action updates a #${id} volunteer`;
	}

	remove(id: number) {
		return `This action removes a #${id} volunteer`;
	}
}
