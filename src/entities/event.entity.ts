import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityCategory } from './activity-category.entity';
import { User } from './user.entity';
import { Volunteer } from './volunteer.entity';
import { Poll } from './poll.entity';

@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column('varchar', { length: 50000 })
	description: string;

	@Column()
	status: string;

	@Column({ default: false })
	isBlog: boolean;

	@Column({ nullable: true })
	location: string;

	@Column()
	date: Date;

	@ManyToOne((type) => Event)
	previousEvent: Event;

	@ManyToOne((type) => Volunteer)
	volunteer: Volunteer;

	@ManyToMany((type) => ActivityCategory, { eager: true })
	@JoinTable()
	activities: ActivityCategory[];

	@ManyToMany((type) => User)
	@JoinTable()
	participants: User[];

	@OneToOne((type) => Poll, (poll) => poll.event, {
		nullable: true,
		eager: true,
		onDelete: 'SET NULL',
	})
	@JoinColumn()
	poll: Poll;
}
