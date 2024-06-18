import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TelegramConnection } from 'src/entities/telegram-connection.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, TelegramConnection]), ConfigModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
