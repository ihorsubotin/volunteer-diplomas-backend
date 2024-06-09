import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { IsLoggedIn } from 'src/auth/guards/loggedIn.guard';
import { UserService } from 'src/user/user.service';

@Controller('volunteer')
export class VolunteerController {
	constructor(
		private volunteerService: VolunteerService,
		private userService: UserService
	) { }

	@UseGuards(IsLoggedIn)
	@Post('account')
	async createVolunteerAccount(@Req() req, @Body() createVolunteerDto: CreateVolunteerDto) {
		if (req.session.user.volunteer) {
			return new BadRequestException('Volunteer is already defined');
		}
		const volunteer = await this.volunteerService.create(createVolunteerDto, req.session.user.id);
		const updatedUser = await this.userService.getExtendedUserById(req.session.user.id);
		req.session.user = updatedUser;
		return volunteer;
	}

	@Get()
	findAll() {
		return this.volunteerService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.volunteerService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateVolunteerDto: UpdateVolunteerDto) {
		return this.volunteerService.update(+id, updateVolunteerDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.volunteerService.remove(+id);
	}
}
