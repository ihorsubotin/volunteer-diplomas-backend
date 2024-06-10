import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramConnection } from 'src/entities/telegram-connection.entity';
import { UserService } from 'src/user/user.service';
import { Repository, IsNull} from 'typeorm';
import * as uid from 'uid-safe';
@Injectable()
export class TelegramService {
	
	constructor(
		@InjectRepository(TelegramConnection)
		private connectionRepository: Repository<TelegramConnection>,
		private userService: UserService
	){}

	async generateConnection(userID: number): Promise<TelegramConnection>{
		const connection = new TelegramConnection();
		connection.user = await this.userService.findOneById(userID);
		connection.connectToken = uid.sync(24);
		connection.validUntil = new Date(Date.now() + 10*60*1000);
		this.connectionRepository.save(connection);
		return connection;
	}

	async getUserConnections(userID: number){
		const user = await this.userService.findOneById(userID);
		if(!user){
			return [];
		}
		const connections = await this.connectionRepository.find({
			where: {
				user: user,
				validUntil: IsNull()
			}
		});
		const result = connections.map((connection)=>{
			const {telegramUser, validUntil, connectToken, ...result} = connection;
			return result;
		})
		return result;
	}

	async getUserConnection(connectionID: number){
		return await this.connectionRepository.findOne({
			where:{
				id: connectionID
			},
			relations: {
				user: true
			}
		});
	}

	async deleteUserConnection(connectionID: number){
		const connection = await this.connectionRepository.findOne({where:{
			id: connectionID
		}});
		if(connection){
			await this.connectionRepository.remove(connection);
			return true;
		}
		return false;
	}

	async validateConnection(token: string){
		const connection = await this.connectionRepository.findOne({
			where: {
				connectToken: token
			},
			relations: {
				user: true,
			}
		});
		if(!connection){
			return null;
		}
		if(!connection.validUntil){
			return null;
		}
		if(connection.validUntil.getTime() < Date.now()){
			return null;
		}
		return connection;
	}
	async saveConnection(connection: TelegramConnection, userInfo: string, telegramUser: number){
		connection.validUntil = null;
		connection.userInfo = userInfo;
		connection.telegramUser = telegramUser;
		this.connectionRepository.save(connection);
	}
}
