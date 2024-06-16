import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/createUserDTO';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import UpdateUserDTO from './dto/updateUserDTO';

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
		if(!email){
			return null;
		}
		return this.userRepository.findOne({where: {
			email: email
		}});
	}
	async findOneById(id: number): Promise<User | null>{
		if(!id){
			return null;
		}
		return this.userRepository.findOne({where: {
			id: id
		}});
	}

	async getExtendedUserById(id: number){
		if(!id){
			return null;
		}
		let {passwordHash, ...user} = await this.userRepository.findOne({
			where: {
				id: id
			},
			relations: {
				volunteer: true,
				contractor: {
					activities: true,
				}
			}
		});
		return user;
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
