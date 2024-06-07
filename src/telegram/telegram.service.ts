import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramConnection } from 'src/entities/telegramConnection.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as uid from 'uid-safe';
@Injectable()
export class TelegramService {
	
	constructor(
		@InjectRepository(TelegramConnection)
		private connectionRepository: Repository<TelegramConnection>
	){}

	async generateConnection(userID: number): Promise<TelegramConnection>{
		const connection = new TelegramConnection();
		connection.userID =userID;
		connection.connectToken = uid.sync(24);
		connection.validUntil = new Date(Date.now() + 10*60*1000);
		this.connectionRepository.save(connection);
		return connection;
	}

	async getUserConnections(userID: number){
		const connections = await this.connectionRepository.find({
			where: {
				userID: userID,
				//validUntil: null,
			}
		});
		const result = connections.map((connection)=>{
			const {sid, validUntil, connectToken, ...result} = connection;
			return result;
		})
		return result;
	}

	async validateConnection(token: string){
		const connection = await this.connectionRepository.findOne({
			where: {
				connectToken: token
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
	async saveConnection(connection: TelegramConnection, userInfo: string, sid: string){
		connection.validUntil = null;
		connection.userInfo = userInfo;
		connection.sid = sid;
		this.connectionRepository.save(connection);
	}
}
