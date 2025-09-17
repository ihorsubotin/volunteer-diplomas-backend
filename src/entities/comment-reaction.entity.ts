import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

export type ReactionType = 'like' | 'dislike';

@Entity()
export class CommentReaction {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => User)
	user: User;

	@ManyToOne((type) => Comment)
	comment: Comment;

	@Column({
		type: 'enum',
		enum: ['like', 'dislike'],
	})
	type: ReactionType;
}
