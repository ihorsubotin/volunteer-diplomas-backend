import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsLoggedIn } from '../auth/guards/loggedIn.guard';
import { TelegramService } from './telegram.service';
import { UserService } from '../user/user.service';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsTelegram } from '../auth/guards/telegram.guard';

class loginDTO{
	@IsNotEmpty()
	token: string;
	@IsNotEmpty()
	userInfo: string;
	@IsNotEmpty()
	telegramUser: string;
}

@Controller('telegram')
export class TelegramController {
	constructor (
		private config: ConfigService,
		private telegramService: TelegramService,
		private userService: UserService,
	){}

	@UseGuards(IsLoggedIn)
	@Post('connection')
	async generateNewConnection(@Req() req){
		let connection = await this.telegramService.generateConnection(req.user.id);
		let url = this.config.get('TELEGRAM_START_URL') + connection.connectToken;
		return {url};
	}

	@UseGuards(IsLoggedIn)
	@Delete('connection/:id')
	async getConnection(@Param() params,  @Req() req){
		if(!params || !params.id){
			throw new NotFoundException();
		}
		const connection = await this.telegramService.getUserConnection(params.id);
		if(connection?.user.id === req.user.id){
			const success = await this.telegramService.deleteUserConnection(params.id);
			if(success){
				return 'Deleted succesfully!';
			}else{
				throw new NotFoundException();
			}
		}
		throw new UnauthorizedException();
	}

	@UseGuards(IsLoggedIn)
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
		const {passwordHash, ...user} = connection.user;
		await this.telegramService.saveConnection(connection, body.userInfo, body.telegramUser);
		return user;
	}
}
