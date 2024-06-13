import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { IsVolunteer } from '../auth/guards/volunteer.guard';
import { FindEventDto } from './dto/find-event.dto';
import { IsLoggedIn } from '../auth/guards/loggedIn.guard';

@Controller('event')
export class EventController {
	constructor(private readonly eventService: EventService) { }

	@UseGuards(IsVolunteer)
	@Post()
	create(@Body() createEventDto: CreateEventDto, @Req() req) {
		if (!req.user.volunteer.validated) {
			throw new UnauthorizedException('Volunteer should be validated');
		}
		return this.eventService.create(createEventDto, req.user.volunteer);
	}

	@UseGuards(IsLoggedIn)
	@Post(':id/participate')
	async participate(@Param('id', ParseIntPipe) id: number, @Req() req){
		const success = await this.eventService.participate(id, req.user);
		if(!success){
			throw new NotFoundException();
		}
		return 'Success';
	}

	@Get('all/:page')
	async findAll(@Param('page', ParseIntPipe) page: number, @Body() body: FindEventDto) {
		if (page <= 0) {
			page = 0;
		}
		return await this.eventService.findAll(page, body);
	}

	@UseGuards(IsVolunteer)
	@Get('my/:page')
	async findMy(@Param('page', ParseIntPipe) page: number, @Body() body: FindEventDto, @Req() req) {
		if (isNaN(page) || page <= 0) {
			page = 0;
		}
		return await this.eventService.findMy(page, body, req.user.volunteer.id);
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const event = await this.eventService.getFullEvent(+id);
		if (!event) {
			throw new NotFoundException();
		}
		return event;
	}

	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
		const event = await this.eventService.update(+id, updateEventDto);
		if(!event){
			throw new NotFoundException();
		}
		return await this.eventService.getFullEvent(id);
	}

	@UseGuards(IsLoggedIn)	
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
		const event = await this.eventService.getFullEvent(id);
		if(!event){
			throw new NotFoundException();
		}
		if(req.user.isAdmin || (req.user.volunteer && req.user.volunteer.id == event.volunteer.id)){
			return this.eventService.remove(+id);
		}
		throw new UnauthorizedException();
	}
}
