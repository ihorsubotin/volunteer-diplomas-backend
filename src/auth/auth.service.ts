import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';

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
			let {passwordHash, ...result} = user;
			return result;
		}else{
			return null;
		}
	}

}
