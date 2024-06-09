import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty } from 'class-validator';
import CreateUserDTO from 'src/user/dto/createUserDTO';
import { UserService } from 'src/user/user.service';
import { IsLoggedIn } from './guards/loggedIn.guard';

class SignInTdo{
	@IsNotEmpty()
	email: string;
	@IsNotEmpty()
	password: string;
}

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService
	){}
	
	@HttpCode(HttpStatus.OK)
	@Post('register')
	async register(@Req() req, @Body() userDTO: CreateUserDTO){
		let {id} = await this.userService.createUser(userDTO);
		const user = await this.userService.getExtendedUserById(id);
		req.session.user = user;
		return req.session.user;
	}

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

	@UseGuards(IsLoggedIn)
	@Delete('logout')
	async logout(@Req() req){
		req.session.destroy();
		return true;
	}
}
