import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Update } from '../entities/telegram-update.entity'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Update]), ConfigModule],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule {}
