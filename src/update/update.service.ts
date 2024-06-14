import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramUpdate } from '../entities/telegram-update.entity'
import { Repository } from 'typeorm';
import { Event } from 'src/entities/event.entity';
import { User } from 'src/entities/user.entity';
import { BrowserUpdate } from 'src/entities/browser-connect,entity';


@Injectable()
export class UpdateService {
	constructor(
		@InjectRepository(TelegramUpdate)
		private telegramUpdateRepository: Repository<TelegramUpdate>,
		private browserUpdateRepository: Repository<BrowserUpdate>
	) { }

	async createForEvent(event: Event) {
		const activities = event.activities.map((a)=>a.id);
		const users: User[] = <any>await this.telegramUpdateRepository.createQueryBuilder("user")
		.innerJoin("user.contractor", "user")
		.innerJoin("contractor.activities", "activity_category")
		.where("activity_category.id IN (:...ids)",{ids: activities}).getMany();
		const content = `Подія ${event.name} відбудеться ${event.date} в ${event.location}. Не пропустіть!`;
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
		}


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
		})
		return unseen;
	}

	confirmViews(ids: number[]){
		if(!ids || ids.length == 0){
			return false;
		}
		const update = this.telegramUpdateRepository.update(ids, {seen: true});
		return true;
	}

	findOne(id: number) {
		return `This action returns a #${id} update`;
	}
}
