import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramUpdate } from '../entities/telegram-update.entity'
import { Repository } from 'typeorm';
import { Event } from 'src/entities/event.entity';
import { User } from 'src/entities/user.entity';
import { BrowserUpdate } from 'src/entities/browser-update.entity';
import { TelegramService } from 'src/telegram/telegram.service';


@Injectable()
export class UpdateService {
	constructor(
		@InjectRepository(TelegramUpdate)
		private telegramUpdateRepository: Repository<TelegramUpdate>,
		@InjectRepository(BrowserUpdate)
		private browserUpdateRepository: Repository<BrowserUpdate>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private telegramService: TelegramService
	) {}

	async createForEvent(event: Event) {
		const activities = event.activities.map((a)=>a.id);
		const users: User[] = <any>await this.userRepository.createQueryBuilder("user")
		.innerJoin("user.contractor", "contractor")
		.innerJoin("contractor.activities", "activity_category")
		.where("activity_category.id IN (:...ids)",{ids: activities}).getMany();
		const dateString = (new Date(event.date)).toDateString();
		const content = `Подія "${event.name}" відбудеться ${dateString} в ${event.location}. Не пропустіть!`;
		const template = {
			content: content,
			time: new Date(),
			seen: false,
			event: event,
		}
		for(const user of users){
			const browserUpdate = new BrowserUpdate();
			this.browserUpdateRepository.merge(browserUpdate, template);
			browserUpdate.user = user;
			this.browserUpdateRepository.save(browserUpdate);
			const connections = await this.telegramService.getUserConnections(user.id);
			for(const connection of connections){
				const telegramUpdate = new TelegramUpdate();
				this.telegramUpdateRepository.merge(telegramUpdate, template);
				telegramUpdate.connection = <any>connection;
				await this.telegramUpdateRepository.save(telegramUpdate);
			}
		}
	}

	getBrowserNotifications(page: number, user: User){
		const notifications = this.browserUpdateRepository.find({
			where: {
				user: user
			},
			order: {
				id: 'ASC'
			},
			take: 10,
			skip: page*10
		});
		return notifications;
	}

	findUnseenTelegram() {
		const unseen = this.telegramUpdateRepository.find({
			where: {
				seen: false
			},
			relations: {
				connection: true,
			},
			order: {
				id: 'ASC',
			},
			take: 10
		});
		return unseen;
	}

	async confirmViewsTelegram(ids: number[]){
		if(!ids || ids.length == 0){
			return false;
		}
		const update = await this.telegramUpdateRepository.update(ids, {seen: true});
		return true;
	}

	
	async confirmViewsBrowser(id: number){
		if(!id){
			return false;
		}
		const update = await this.browserUpdateRepository.update(id, {seen: true});
		return true;
	}


	findOneBrowserUpdate(id: number) {
		if(!id){
			return null;
		}
		return this.browserUpdateRepository.findOne({
			where: {id: id},
			relations: {user: true}
		});
	}
}
