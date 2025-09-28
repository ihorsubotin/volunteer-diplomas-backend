import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Poll } from './poll.entity';

@Entity()
export class PollVote {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => User)
	user: User;

	@ManyToOne((type) => Poll, { onDelete: 'CASCADE' })
	poll: Poll;

	@Column()
	vote: number;
}
