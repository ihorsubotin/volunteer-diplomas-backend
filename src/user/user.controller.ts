import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {

	constructor(
		private userService: UserService
	){}

	@Get('me')
	getMe(){
		return 'me';
	}

	@Get()
	getAll(){
		return this.userService.findAll();
	}

	@Post()
	createUser(){
		this.userService.createUser({
			firstName: 'Ihor',
			lastName: 'Subotin',
			isAdmin: true,
		});
	}

}
