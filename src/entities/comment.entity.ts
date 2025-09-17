import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { CommentReaction, ReactionType } from './comment-reaction.entity';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 2000 })
	content: string;

	@CreateDateColumn()
	creationTime: Date;

	@ManyToOne((type) => User)
	user: User;

	@ManyToOne((type) => Event)
	event: Event;

	@ManyToOne((type) => Comment, { nullable: true, onDelete: 'CASCADE'})
	replyTo: Comment;

	@Column({ default: 0 })
	likes: number;

	@Column({ default: 0 })
	dislikes: number;

	reaction: ReactionType;

	@Column({default: false})
	edited: boolean;
	
	@UpdateDateColumn()
	updateTime: Date;
}
