import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	){}

	findAll(): Promise<User[]>{
		return this.userRepository.find();
	}

	createUser(user: any): Promise<User>{
		return this.userRepository.save(user);
	}
}
