import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggedIn } from 'src/auth/guards/loggedIn.guard';
import { TelegramService } from './telegram.service';
import { UserService } from 'src/user/user.service';
import { IsNotEmpty } from 'class-validator';
import { IsTelegram } from 'src/auth/guards/telegram.guard';

class loginDTO{
	@IsNotEmpty()
	token: string;
	@IsNotEmpty()
	userInfo: string;
	@IsNotEmpty()
	telegramUser: number;
}

@Controller('telegram')
export class TelegramController {
	constructor (
		private config: ConfigService,
		private telegramService: TelegramService,
		private userService: UserService,
	){}

	@UseGuards(LoggedIn)
	@Post('connection')
	async getConnection(@Req() req){
		let connection = await this.telegramService.generateConnection(req.user.id);
		let url = this.config.get('TELEGRAM_START_URL') + connection.connectToken;
		return {url};
	}

	@UseGuards(LoggedIn)
	@Get('connections')
	async getMyConnections(@Req() req){
		return this.telegramService.getUserConnections(req.user.id);
	}

	@UseGuards(IsTelegram)
	@Post('login')
	async loginViaToken(@Req() req, @Body() body: loginDTO){
		const connection = await this.telegramService.validateConnection(body.token);
		if(!connection){
			throw new UnauthorizedException();
		}
		const {passwordHash, ...user} = await this.userService.findOneById(connection.userID);
		req.session.user = user;
		await this.telegramService.saveConnection(connection, body.userInfo, req.session.id);
		return user;
	}
}
