import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventService } from './event.service';
import { HttpService } from '@nestjs/axios';
import { HTMLElement, parse } from 'node-html-parser';

const MISKRADA_ID = 6;
const VODOKANAL_ID = 7;
@Injectable()
export class OfficialEventsService {
	constructor(
		private readonly eventService: EventService,
		private readonly httpService: HttpService,
	) {}

	@Cron('00 00 * * * *')
	handleOfficialUpdats() {
		this.checkForMiskrada();
		this.checkForVodokanal();
	}

	async checkForMiskrada() {
		const currentEvents = await this.eventService.findMy(0, {}, MISKRADA_ID);
		const page = this.httpService.get(`https://chernigiv-rada.gov.ua/news/`);
		const root = parse((await page.toPromise()).data);
		const allNews = root.querySelectorAll('.listNews .itemListNews');
		const parsedNews: any = allNews.map((element) => {
			return {
				name: element.querySelector('.headLine').innerText,
				date: element.querySelector('.date').innerText,
				href: element.querySelector('a').getAttribute('href'),
			};
		});
		const toUpdate = [];
		for (const news of parsedNews) {
			if (currentEvents.find((value) => value.name == news.name)) {
				break;
			}
			const articlePage = this.httpService.get(
				`https://chernigiv-rada.gov.ua/${news.href}`,
			);
			const articleRoot = parse((await articlePage.toPromise()).data);
			news.description = this.getStringUpToSize(
				articleRoot.querySelector('.textContent'),
				50000,
			);
			toUpdate.push(news);
		}
		for (const update of toUpdate.reverse()) {
			await this.createEventAsUpdate(update, MISKRADA_ID);
		}
	}

	async checkForVodokanal() {
		const currentEvents = await this.eventService.findMy(0, {}, VODOKANAL_ID);
		const page = this.httpService.get(`https://water.cn.ua/news`);
		const root = parse((await page.toPromise()).data);
		const allNews = root.querySelectorAll('#news-result .news-body');
		const parsedNews: any = allNews.map((element) => {
			return {
				name: element.querySelector('.news-title').innerText,
				date: element.querySelector('.date').innerText,
				href: element.querySelector('a').getAttribute('href'),
			};
		});
		const toUpdate = [];
		for (const news of parsedNews) {
			if (currentEvents.find((value) => value.name == news.name)) {
				break;
			}
			const articlePage = this.httpService.get(
				`https://water.cn.ua${news.href}`,
			);
			const articleRoot = parse((await articlePage.toPromise()).data);
			news.description = this.getStringUpToSize(
				articleRoot.querySelector('.news-item-text'),
				50000,
			);
			toUpdate.push(news);
		}
		for (const update of toUpdate.reverse()) {
			await this.createEventAsUpdate(update, VODOKANAL_ID);
		}
	}

	getStringUpToSize(element: HTMLElement, size: number) {
		let description = element?.innerHTML;
		if (description.length > size) {
			description = '';
			for (const child of element.children) {
				if (child.outerHTML.length + description.length < size) {
					description += child.outerHTML;
				} else {
					break;
				}
			}
		}
		return description;
	}

	createEventAsUpdate(update, volunteerId) {
		return this.eventService.create(
			{
				...update,
				activities: [14],
				location: 'Чернігів',
				date: new Date(),
				status: 'Завершено',
			},
			{ volunteer: { id: volunteerId } } as any,
			null,
		);
	}
}
