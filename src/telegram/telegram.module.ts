import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramConnection } from 'src/entities/telegram-connection.entity';
import { ConfigModule } from '@nestjs/config';
import { TelegramController } from './telegram.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramConnection]), ConfigModule, UserModule],
  providers: [TelegramService],
  controllers: [TelegramController]
})
export class TelegramModule {}
