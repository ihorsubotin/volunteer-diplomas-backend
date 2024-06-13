import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
	constructor(private userService: UserService){}

	async validateUser(email: string, password: string){
		const user : User = await this.userService.findOneByEmail(email);
		if(!user){
			return null;
		}
		let saltedPassword = user.id + password;
		const match = await bcrypt.compare(saltedPassword, user.passwordHash);
		if(match){
			return await this.userService.getExtendedUserById(user.id);
		}else{
			return null;
		}
	}
}
