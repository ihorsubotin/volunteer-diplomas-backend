import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException, NotFoundException, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { IsLoggedIn } from '../auth/guards/loggedIn.guard';
import { UserService } from '../user/user.service';
import { FindVolunteerDto } from './dto/find-volunteer.dto';
import { IsAdmin } from '../auth/guards/admin.guard';

@Controller('volunteer')
export class VolunteerController {
	constructor(
		private volunteerService: VolunteerService,
		private userService: UserService
	) {}

	@UseGuards(IsLoggedIn)
	@Post('account')
	async createVolunteerAccount(@Req() req, @Body() createVolunteerDto: CreateVolunteerDto) {
		if (req.user.volunteer) {
			return new BadRequestException('Volunteer is already defined');
		}
		const volunteer = await this.volunteerService.create(createVolunteerDto, req.user.id);
		const updatedUser = await this.userService.getExtendedUserById(req.user.id);
		req.session.user = updatedUser;
		return volunteer;
	}

	@Post('list/:page')
	find(@Param('page') page: string, @Body() body: FindVolunteerDto) {
		if(!(+page)){
			page = '0';
		}
		return this.volunteerService.find(+page, body);
	}

	@Get(':id')
	async findOne(@Param('id') id: string, @Req() req) {
		if(req.session.user && req.session.user.volunteer && id == 'me'){
			id = req.session.user.volunteer.id;
		}
		const volunteer = await this.volunteerService.findFullVolunteer(+id);
		if(!volunteer){
			throw new NotFoundException();
		}
		return volunteer;
	}

	@UseGuards(IsAdmin)
	@Patch(':id/validate')
	async validate(@Param('id', ParseIntPipe) id: number){
		console.log(id);
		const volunteer = await this.volunteerService.validate(id);
		if(!volunteer){
			throw new NotFoundException('Volunteer not found');	
		}
		return volunteer;
	}

	@UseGuards(IsLoggedIn)
	@Patch(':id')
	async update(@Param('id') id: string, @Req() req, @Body() updateVolunteerDto: UpdateVolunteerDto) {
		if(req.user.volunteer && id == 'me'){
			id = req.user.volunteer.id;
		}
		if(req.user.isAdmin || (id && req.user.volunteer && req.user.volunteer.id == id)){
			const volunteer = await this.volunteerService.update(+id, updateVolunteerDto);
			if(!volunteer){
				throw new NotFoundException();
			}
			return volunteer;
		}
		throw new UnauthorizedException();
	}
}
