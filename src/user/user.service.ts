import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDTO from './DTO/createUserDTO';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import UpdateUserDTO from './DTO/updateUserDTO';

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

	async findOneByEmail(email: string): Promise<User | null>{
		return this.userRepository.findOne({where: {
			email: email
		}});
	}
	async findOneById(id: number): Promise<User | null>{
		return this.userRepository.findOne({where: {
			id: id
		}});
	}

	async updateUser(id: number, update: UpdateUserDTO){
		const user = await this.userRepository.findOne({where:{
			id: id
		}});
		if(user){
			this.userRepository.merge(user, update);
			await this.userRepository.save(user);
			return user;
		}
		return null;
	}

	async updatePassword(id: number, password: string){
		const user = await this.userRepository.findOne({where:{
			id: id
		}});
		if(user){
			let saltedPassword = id + password;
			let saltRounds = Number(this.config.get('SALT_ROUNDS'));
			user.passwordHash = await bcrypt.hash(saltedPassword, saltRounds);
			await this.userRepository.save(user);  
			return true;
		}
		return false;
	}
	async deleteUser(id: number){
		const user = await this.userRepository.findOne({where:{
			id: id
		}});
		if(user){
			await this.userRepository.remove(user);
			return true;
		}
		return false;
	}
}
