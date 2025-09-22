import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	UnauthorizedException,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollByEventPipe } from './pipe/poll-by-event.pipe';
import { Poll } from 'src/entities/poll.entity';
import { EventByIdPipe } from 'src/event/pipe/event-by-id.pipe';
import { IsLoggedIn } from 'src/auth/guards/loggedIn.guard';
import { Event } from 'src/entities/event.entity';
import { EventService } from 'src/event/event.service';

@Controller('event/:eventId/poll')
export class PollController {
	constructor(
		private readonly pollService: PollService,
		private readonly eventService: EventService
	) {}

	@UseGuards(IsLoggedIn)
	@Post()
	async createPoll(
		@Param('eventId', EventByIdPipe) event: Event,
		@Body() createPollDto: CreatePollDto,
		@Req() req,
	) {
		const fullEvent = await this.eventService.getFullEvent(event.id);
		if(event.poll){
			throw new BadRequestException('Poll already exist');
		}
		if(req.user.isAdmin || (req.user.volunteer && req.user.volunteer.id == fullEvent.volunteer.id)){
			return this.pollService.create(event, createPollDto);
		}else{
			throw new UnauthorizedException("You can't create poll here");
		}
	}

	@Get()
	async findByEvent(
		@Param('eventId', PollByEventPipe) poll: Poll,
		@Req() req
	) {
		return await this.pollService.getUserVote(poll, req?.session?.user);
	}

	@UseGuards(IsLoggedIn)
	@Patch()
	async update(
		@Param('eventId') eventId: string, 
		@Param('eventId', PollByEventPipe) poll: Poll, 
		@Body() updatePollDto: UpdatePollDto,
		@Req() req,	
	) {
		const fullEvent = await this.eventService.getFullEvent(+eventId);
		if(poll.questions.length != updatePollDto.questions.length){
			throw new BadRequestException('Questions size must be equal');
		}
		if(req.user.isAdmin || (req.user.volunteer && req.user.volunteer.id == fullEvent.volunteer.id)){
			const updatedPoll = await this.pollService.update(poll, updatePollDto);
			return await this.pollService.getUserVote(poll, req.user);
		}else{
			throw new UnauthorizedException("You can't update poll here");
		}
	}

	@UseGuards(IsLoggedIn)
	@Delete()
	async remove(
		@Param('eventId') eventId: string, 
		@Param('eventId', PollByEventPipe) poll: Poll,
		@Req() req,
	) {
		const fullEvent = await this.eventService.getFullEvent(+eventId);
		if(req.user.isAdmin || (req.user.volunteer && req.user.volunteer.id == fullEvent.volunteer.id)){
			return this.pollService.remove(poll);
		}else{
			throw new UnauthorizedException("You can't delete this poll");
		}
	}

	@UseGuards(IsLoggedIn)
	@Post(':vote')
	async vote(
		@Param('vote') vote: string,
		@Param('eventId', PollByEventPipe) poll: Poll,
		@Req() req,
	){
		if(vote && !isNaN(+vote)){
			if(+vote >= 0 && +vote < poll.questions.length){
				return await this.pollService.vote(poll, req.user, +vote);
			}else{
				throw new NotFoundException('Vote number does not exist');
			}
		}else{
			throw new BadRequestException('Vote number is incorrect');
		}
	}
}
