import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsLoggedIn } from '../auth/guards/loggedIn.guard';
import { TelegramService } from './telegram.service';
import { UserService } from '../user/user.service';
import { IsTelegram } from '../auth/guards/telegram.guard';
import { LoginDTO } from './dto/telegram-login.dto'
import { CreateAccountDto } from './dto/create-account.dto';
import { TelegramUserDto } from './dto/logout.dto';
 
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
	async loginViaToken(@Req() req, @Body() body: LoginDTO){
		const connection = await this.telegramService.validateConnection(body.token);
		if(!connection){
			throw new UnauthorizedException();
		}
		const oldUser = await this.telegramService.getUserByTelegram(body.telegramUser);
		if(oldUser){
			throw new UnauthorizedException('Telegram id already registered');
		}
		const {passwordHash, ...user} = connection.user;
		await this.telegramService.saveConnection(connection, body.userInfo, body.telegramUser);
		return user;
	}

	@UseGuards(IsTelegram)
	@Post('create-account')
	async newAccount(@Body() createAccountDto: CreateAccountDto){
		const oldUser = await this.telegramService.getUserByTelegram(createAccountDto.telegramUser);
		if(oldUser){
			throw new UnauthorizedException('Telegram id already registered');
		}
		const account = await this.telegramService.createAccount(createAccountDto);
		return account;
	}

	@UseGuards(IsTelegram)
	@Post('generate-register-link')
	async generateLink(@Body() generateLink: TelegramUserDto){
		const user = await this.telegramService.getUserByTelegram(generateLink.telegramUser);
		if(!user){
			throw new NotFoundException('User not found');
		}
		if(!user.isPartial){
			throw new UnauthorizedException('User is not partial');
		}
		const link = await this.telegramService.generateLink(generateLink.telegramUser);
		return {url: link};
	}

	@UseGuards(IsTelegram)
	@Post('logout')
	async logout(@Body() logoutDto: TelegramUserDto){
		const success = this.telegramService.logout(logoutDto.telegramUser);
		return success;
	}
}
