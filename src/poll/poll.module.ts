import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { Poll } from 'src/entities/poll.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollByEventPipe } from './pipe/poll-by-event.pipe';
import { EventModule } from 'src/event/event.module';
import { PollVote } from 'src/entities/poll-vote.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Poll, PollVote]), EventModule],
	controllers: [PollController],
	providers: [PollService, PollByEventPipe],
})
export class PollModule {}
