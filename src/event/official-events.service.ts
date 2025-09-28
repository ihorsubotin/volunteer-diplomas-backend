import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventService } from './event.service';
import { HttpService } from '@nestjs/axios';
import { HTMLElement, parse } from 'node-html-parser';

const MISKRADA_ID = 6;
const VODOKANAL_ID = 7;
const CHOE_ID = 8;
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
		this.checkForChOE();
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
				'https://chernigiv-rada.gov.ua/',
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
				'https://water.cn.ua/',
			);
			toUpdate.push(news);
		}
		for (const update of toUpdate.reverse()) {
			await this.createEventAsUpdate(update, VODOKANAL_ID);
		}
	}

	async checkForChOE() {
		const currentEvents = await this.eventService.findMy(0, {}, CHOE_ID);
		const page = this.httpService.get(
			`https://chernihivoblenergo.com.ua/list/news`,
		);
		const root = parse((await page.toPromise()).data);
		const allNews = root.querySelectorAll('.news_list .news_cards-item');
		const parsedNews: any = allNews.map((element) => {
			return {
				name: element.querySelector('.news_cards-title').innerText.trim(),
				date: element.querySelector('.news_cards-date').innerText.trim(),
				href: element.getAttribute('href'),
			};
		});
		const toUpdate = [];
		for (const news of parsedNews) {
			if (currentEvents.find((value) => value.name == news.name)) {
				break;
			}
			const articlePage = this.httpService.get(
				`https://chernihivoblenergo.com.ua${news.href}`,
			);
			const articleRoot = parse((await articlePage.toPromise()).data);
			news.description = this.getStringUpToSize(
				articleRoot.querySelector('.page_text'),
				50000,
				'https://chernihivoblenergo.com.ua/',
			);
			toUpdate.push(news);
		}
		for (const update of toUpdate.reverse()) {
			await this.createEventAsUpdate(update, CHOE_ID);
		}
	}

	getStringUpToSize(element: HTMLElement, size: number, origin: string) {
		let description = '';
		for (const child of element.children) {
			const nextToken = child.outerHTML.replaceAll(
				/(src|href)="(?!http)\/?/g,
				'src="' + origin,
			);
			if (nextToken.length + description.length < size) {
				description += nextToken;
			} else {
				break;
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
				isBlog: true,
				date: new Date(),
				status: 'Завершено',
			},
			{ volunteer: { id: volunteerId } } as any,
			null,
		);
	}
}
