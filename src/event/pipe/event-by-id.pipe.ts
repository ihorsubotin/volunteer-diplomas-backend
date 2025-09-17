import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { EventService } from 'src/event/event.service';

@Injectable()
export class EventByIdPipe implements PipeTransform<string, Promise<any>> {
	constructor(private readonly eventsService: EventService) {}

	async transform(eventId: string) {
		const event = await this.eventsService.getEventById(eventId);
		if (!event) {
			throw new NotFoundException(`Event with ID "${eventId}" not found`);
		}
		return event;
	}
}
