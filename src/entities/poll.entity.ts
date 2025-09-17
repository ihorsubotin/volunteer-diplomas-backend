import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Poll {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column('simple-array')
	questions: string[];

	@Column('simple-array')
	responded: number[];

	@OneToOne((type) => Event, (event) => event.poll)
	event: Event;
}
