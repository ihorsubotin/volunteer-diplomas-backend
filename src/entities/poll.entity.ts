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

	@Column({default: false})
	edited: boolean;
	
	@Column("int", { array: true })
	responded: number[];

	@OneToOne((type) => Event, (event) => event.poll)
	event: Event;

	vote: number;
}
