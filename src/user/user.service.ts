import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDTO from './DTO/createUserDTO';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private config: ConfigService,
	){}

	async findAll(): Promise<User[]>{
		return this.userRepository.find();
	}

	async createUser(user: CreateUserDTO): Promise<User>{
		let userObj = new User();
		this.userRepository.merge(userObj, user);
		userObj.passwordHash = "";
		await this.userRepository.save(userObj);
		let saltedPassword = userObj.id + user.password;
		let saltRounds = Number(this.config.get('SALT_ROUNDS'));
		userObj.passwordHash = await bcrypt.hash(saltedPassword, saltRounds);
		await this.userRepository.save(userObj);  
		return userObj;
	}

	async findOne(email: string): Promise<User | null>{
		return this.userRepository.findOne({where: {
			email: email
		}});
	}

}
