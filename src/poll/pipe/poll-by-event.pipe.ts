import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Poll } from 'src/entities/poll.entity';
import { PollService } from '../poll.service';

@Injectable()
export class PollByEventPipe implements PipeTransform<string, Promise<Poll>> {
	constructor(private readonly pollService: PollService) {}

	async transform(eventId: string) {
		const poll = await this.pollService.findByEvent(eventId);
		if (!poll) {
			throw new NotFoundException(`Event with ID "${eventId}" have no polls`);
		}
		return poll;
	}
}
