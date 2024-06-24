import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Volunteer } from '../entities/volunteer.entity';
import { ActivityCategoryService } from '../activity-category/activity-category.service';
import { FindEventDto } from './dto/find-event.dto';
import { UpdateService } from 'src/update/update.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private activityCategoryService: ActivityCategoryService,
		private updateService: UpdateService
	){}

	async create(createEventDto: CreateEventDto, user: User, previousEvent: Event) {
		const event = new Event();
		event.name = createEventDto.name;
		event.description = createEventDto.description;
		event.status = createEventDto.status;
		event.location = createEventDto.location;
		event.date = createEventDto.date;
		event.volunteer = user.volunteer;
		event.activities = this.activityCategoryService.convertActivitiesToArray(createEventDto.activities);
		if(previousEvent){
			event.previousEvent = previousEvent;
			event.participants = previousEvent.participants;
		}else{
			event.participants = [user];
		}
		await this.eventRepository.save(event);
		this.updateService.createForEvent(event);
		return event;
	}

	async participate(id: number, user){
		const event = await this.eventRepository.findOne({where:{id}, relations: {participants:true}});
		if(!event){
			return false;
		}
		event.participants.push(user);
		await this.eventRepository.save(event);
		return true;
	}

	async leave(id: number, user){
		const event = await this.eventRepository.findOne({where:{id}, relations: {participants:true}});
		if(!event){
			return false;
		}
		const newParticipants = event.participants.filter((u)=>u.id != user.id);
		if(event.participants.length > newParticipants.length){
			event.participants = newParticipants;
			await this.eventRepository.save(event);
			return true;
		}
		return false;
	}

	async getEventWithParticipants(eventId: number){
		if(!eventId){
			return null;
		}
		const event = await this.eventRepository.findOne({
			where:{id: eventId}, 
			relations: {volunteer: true, participants: true},
		});
		if(!event){
			return null;
		}
		return event;
	}

	async getFullEvent(eventId: number): Promise<Event>{
		const event = <any>await this.eventRepository.findOne({
			where:{id: eventId}, 
			relations: {volunteer: true, activities: true},
		});
		if(!event){
			return null;
		}
		event.participantsCount = await this.eventRepository.createQueryBuilder("event")
		.where("event.id = :id", {id: eventId})
		.innerJoin('event.participants', 'user').getCount();
		return event;
	}
 
	async findAll(page: number, params: FindEventDto) {
		let querry = this.eventRepository.createQueryBuilder("event")
		.innerJoin("event.activities", "activity_category")
		.skip(page * 10).take(10).orderBy("event.id", "DESC");
		if(params.search){
			const querryString = `%${params.search}%`;
			querry = querry.andWhere(
			"event.name LIKE :name OR event.description LIKE :name OR location LIKE :name",
			{name: querryString});
		}
		if(params.activities?.length > 0){
			querry = querry.andWhere("activity_category.id IN (:...ids)",{ids: params.activities});
		}
		const events = <any>await querry.getMany();
		for (const event of events){
			const {volunteer} = await this.eventRepository.findOne({where: {id: event.id}, relations: {volunteer: true}});
			event.volunteer = volunteer;
			event.participantsCount = await this.eventRepository.createQueryBuilder("event")
			.where("event.id = :id", {id: event.id})
			.innerJoin('event.participants', 'user').getCount();
		}
		return events;
	}
	
	async findMy(page: number, params: FindEventDto, volunteerId: number) {
		let querry = this.eventRepository.createQueryBuilder("event")
		.innerJoin("event.activities", "activity_category")
		.innerJoin("event.volunteer", "volunteer")
		.where('volunteer.id = :id', {id: volunteerId});

		if(params.search){
			const querryString = `%${params.search}%`;
			querry = querry.andWhere(
			"event.name LIKE :name OR event.description LIKE :name OR location LIKE :name",
			{name: querryString});
		}
		if(params.activities?.length > 0){
			querry = querry.andWhere("activity_category.id IN (:...ids)",{ids: params.activities});
		}
		const events = <any>await querry.skip(page * 10).take(10).orderBy("event.id", "DESC").getMany();
		for (const event of events){
			const {volunteer} = await this.eventRepository.findOne({where: {id: event.id}, relations: {volunteer: true}});
			event.volunteer = volunteer;
			event.participantsCount = await this.eventRepository.createQueryBuilder("event")
			.where("event.id = :id", {id: event.id})
			.innerJoin('event.participants', 'user').getCount();
		}
		return events;
	}

	async findParticipate(page: number, params: FindEventDto, userId: number) {
		let querry = this.eventRepository.createQueryBuilder("event")
		.innerJoin("event.activities", "activity_category")
		.innerJoin("event.participants", "user")
		.where('user.id = :id', {id: userId});

		if(params.search){
			const querryString = `%${params.search}%`;
			querry = querry.andWhere(
			"event.name LIKE :name OR event.description LIKE :name OR location LIKE :name",
			{name: querryString});
		}
		if(params.activities?.length > 0){
			querry = querry.andWhere("activity_category.id IN (:...ids)",{ids: params.activities});
		}
		const events = <any>await querry.skip(page * 10).take(10).orderBy("event.id", "DESC").getMany();
		for (const event of events){
			const {volunteer} = await this.eventRepository.findOne({where: {id: event.id}, relations: {volunteer: true}});
			event.volunteer = volunteer;
			event.participantsCount = await this.eventRepository.createQueryBuilder("event")
			.where("event.id = :id", {id: event.id})
			.innerJoin('event.participants', 'user').getCount();
		}
		return events;
	}

	async update(id: number, updateEventDto: UpdateEventDto) {
		const event = await this.eventRepository.findOne({where: {id: id}});
		if(!event){
			return null;
		}
		const {activities, previousEvent, ...fields} = updateEventDto;
		this.eventRepository.merge(event, fields);
		await this.eventRepository.save(event);
		return event;
	}

	remove(id: number) {
		return this.eventRepository.delete(id);
	}
}
