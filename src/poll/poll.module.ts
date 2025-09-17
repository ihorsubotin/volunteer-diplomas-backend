import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { Poll } from 'src/entities/poll.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Poll])],
	controllers: [PollController],
	providers: [PollService],
})
export class PollModule {}
