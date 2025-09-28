import { Injectable } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Repository } from 'typeorm';
import { Poll } from 'src/entities/poll.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { PollVote } from 'src/entities/poll-vote.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PollService {
	constructor(
		@InjectRepository(Poll)
		private pollRepository: Repository<Poll>,
		@InjectRepository(PollVote)
		private pollVoteRepository: Repository<PollVote>,
	) {}

	async create(event: Event, createPollDto: CreatePollDto) {
		const poll = new Poll();
		poll.title = createPollDto.title;
		poll.questions = createPollDto.questions;
		poll.event = event;
		poll.responded = new Array(createPollDto.questions.length).fill(0);
		await this.pollRepository.save(poll);
		return poll;
	}

	async findByEvent(eventId: string) {
		if (eventId && !isNaN(+eventId)) {
			return await this.pollRepository.findOne({
				where: { event: { id: +eventId } },
			});
		} else {
			return null;
		}
	}

	async update(poll: Poll, updatePollDto: UpdatePollDto) {
		if (updatePollDto.title) {
			poll.title = updatePollDto.title;
		}
		if (updatePollDto.questions) {
			poll.questions = updatePollDto.questions;
		}
		poll.edited = true;
		await this.pollRepository.save(poll);
		return poll;
	}

	async remove(poll: Poll) {
		await this.pollRepository.remove(poll);
		return poll;
	}

	async vote(poll: Poll, user: User, vote: number) {
		if (!poll?.id || !user?.id) {
			return null;
		}
		const pollVote = await this.pollVoteRepository.findOne({
			where: { poll: { id: poll.id }, user: { id: user.id } },
		});
		if (pollVote) {
			if (pollVote.vote == vote) {
				await this.pollVoteRepository.remove(pollVote);
				poll.responded[vote] -= 1;
				await this.pollRepository.save(poll);
				poll.vote = null;
			} else {
				poll.responded[pollVote.vote] -= 1;
				poll.responded[vote] += 1;
				await this.pollRepository.save(poll);
				pollVote.vote = vote;
				await this.pollVoteRepository.save(pollVote);
				poll.vote = vote;
			}
		} else {
			const newVote = new PollVote();
			newVote.poll = poll;
			newVote.user = user;
			newVote.vote = vote;
			await this.pollVoteRepository.save(newVote);
			poll.responded[vote] += 1;
			await this.pollRepository.save(poll);
			poll.vote = vote;
		}
		return poll;
	}
	async getUserVote(poll: Poll, user: User) {
		if (user?.id && poll?.id) {
			const pollVote = await this.pollVoteRepository.findOne({
				where: { poll: { id: poll.id }, user: { id: user.id } },
			});
			if (pollVote) {
				poll.vote = pollVote.vote;
			} else {
				poll.vote = null;
			}
		} else {
			poll.vote = null;
		}
		return poll;
	}
}
