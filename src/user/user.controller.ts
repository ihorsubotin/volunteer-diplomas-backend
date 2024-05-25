import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import CreateUserDTO from './DTO/createUserDTO';
import { LoggedIn } from 'src/auth/loggedIn.guard';
import { Admin } from 'src/auth/admin.guard';



@Controller('user')
export class UserController {

	constructor(
		private userService: UserService
	){}

	@UseGuards(LoggedIn)
	@Get('me')
	getMe(@Req() req){
		return req.user;
	}

	@Get()
	getAll(){
		return this.userService.findAll();
	}

	@UseGuards(Admin)
	@Post()
	createUser(@Body() userDTO: CreateUserDTO){
		return this.userService.createUser(userDTO);
	}

}
