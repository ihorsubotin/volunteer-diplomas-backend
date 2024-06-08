import { Body, Controller, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty } from 'class-validator';

class SignInTdo{
	@IsNotEmpty()
	email: string;
	@IsNotEmpty()
	password: string;
}

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService){}
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async signIn(@Req() req, @Body() signIn : SignInTdo){
		const user = await this.authService.validateUser(signIn.email, signIn.password);
		if(!user){
			throw new UnauthorizedException();
		}
		req.session.user = user;
		return req.session.user;
	}
}
