import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramConnection } from '../entities/telegram-connection.entity';
import { UserService } from '../user/user.service';
import { Repository, IsNull, Not} from 'typeorm';
import * as uid from 'uid-safe';
import { CreateAccountDto } from './dto/create-account.dto';
import { ContractorService } from 'src/contractor/contractor.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TelegramService {
	
	constructor(
		@InjectRepository(TelegramConnection)
		private connectionRepository: Repository<TelegramConnection>,
		private configService: ConfigService,
		private userService: UserService,
		private contractorService: ContractorService
	){}

	async createAccount(createAccountDto: CreateAccountDto){
		const user = await this.userService.createPartialUser(createAccountDto);
		const contractor = await this.contractorService.create({activities: createAccountDto.activities}, user);
		const connection = await this.generateConnection(user.id);
		await this.saveConnection(connection, createAccountDto.userInfo, createAccountDto.telegramUser);
		return await this.userService.getExtendedUserById(user.id);
 	}

	async generateConnection(userID: number): Promise<TelegramConnection>{
		const user = await this.userService.findOneById(userID);
		const oldConnections = await this.connectionRepository.find({
			where: {
				user: user, 
				validUntil: Not(IsNull())
			}
		});
		let connection = null;
		if(oldConnections.length > 0){
			let toRemove;
			if(oldConnections[0].validUntil > new Date(Date.now() - 2*10*1000)){
				connection = oldConnections[0];
				toRemove = oldConnections.slice(1);
			}else{
				toRemove = oldConnections;
			}
			this.connectionRepository.remove(toRemove);
		}
		if(!connection){
			connection = new TelegramConnection();
			connection.user = user;
			connection.connectToken = uid.sync(24);
		}
		connection.validUntil = new Date(Date.now() + 10*60*1000);
		await this.connectionRepository.save(connection);
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
		if(connection.user.isPartial){
			return null;
		}
		return connection;
	}

	async saveConnection(connection: TelegramConnection, userInfo: string, telegramUser: string){
		connection.validUntil = null;
		connection.userInfo = userInfo;
		connection.telegramUser = telegramUser;
		await this.connectionRepository.save(connection);
	}

	async getUserByTelegram(telegramId: string){
		if(!telegramId){
			return null;
		}
		const connection = await this.connectionRepository.findOne({
			where:{
				telegramUser: telegramId	
			},
			relations:{
				user: true
			}
		});
		if(!connection){
			return null;
		}
		return connection.user;
	}

	async generateLink(telegramUser: string){
		const connection = await this.connectionRepository.findOne({
			where: {telegramUser: telegramUser},
			relations: {user: true}
		});
		connection.validUntil = new Date(Date.now() + 30 * 60 * 1000);
		await this.connectionRepository.save(connection);
		const link = `${this.configService.get('REGISTER_URL')}?token=${connection.connectToken}&firstName=${encodeURI(connection.user.firstName)}`; //&region=${encodeURI(connection.user.region)}
		return link;
	}

	async logout(telegramUser: string){
		const connection = await this.connectionRepository.findOne({where:{telegramUser: telegramUser}});
		if(connection){
			await this.connectionRepository.delete(connection.id);
			return true;
		}
		return false;
	}
}
