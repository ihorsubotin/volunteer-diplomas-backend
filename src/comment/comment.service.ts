import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { User } from 'src/entities/user.entity';
import { Event } from 'src/entities/event.entity';
import {
	CommentReaction,
	ReactionType,
} from 'src/entities/comment-reaction.entity';
import { UpdateCommentDTO } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(Comment)
		private commentRepository: Repository<Comment>,
		@InjectRepository(CommentReaction)
		private reactionRepository: Repository<CommentReaction>,
	) {}

	async getCommentById(commentId: string) {
		if (!commentId || isNaN(+commentId)) {
			return null;
		}
		return await this.commentRepository.findOne({ where: { id: +commentId } });
	}

	async getAllCommentsOnEvent(eventId: number, user: User) {
		const comments = await this.commentRepository.find({
			where: { event: { id: eventId } },
			relations: { user: true, replyTo: true },
			select: {
				id: true,
				content: true,
				creationTime: true,
				updateTime: true,
				likes: true,
				dislikes: true,
				edited: true,
				user: { firstName: true, lastName: true },
				replyTo: { id: true },
			},
		});
		comments.sort((a, b) => b.likes - b.dislikes - a.likes + a.dislikes);
		//Setting reactions for logged in users
		if (user) {
			const reactions = await this.reactionRepository.find({
				where: {
					user: { id: user.id },
					comment: { event: { id: eventId } },
				},
				relations: {
					comment: true,
				},
			});
			for (const reaction of reactions) {
				const commentIndex = comments.findIndex(
					(comment) => comment.id == reaction.comment.id,
				);
				comments[commentIndex].reaction = reaction.type;
			}
		}
		return comments;
	}

	async getCommentAuthor(comment: Comment): Promise<User>{
		const commentRecord = await this.commentRepository.findOne({where: {id: comment.id}, relations: {user: true}});
		return commentRecord.user;
	}

	async createComment(
		createCommentDTO: CreateCommentDTO,
		event: Event,
		user: User,
	) {
		const comment = new Comment();
		comment.content = createCommentDTO.content;
		comment.event = event;
		comment.user = user;
		comment.replyTo = null;
		if (createCommentDTO.replyTo) {
			const reply = await this.commentRepository.findOne({
				where: { id: createCommentDTO.replyTo },
				relations: { event: true },
			});
			if (reply.event.id == event.id) {
				comment.replyTo = { id: createCommentDTO.replyTo } as Comment;
			}
		}
		await this.commentRepository.save(comment);
		return comment;
	}

	async setReaction(comment: Comment, user: User, reaction: ReactionType) {
		const currentReaction = await this.reactionRepository.findOne({
			where: { comment: { id: comment.id }, user: { id: user.id } },
		});
		if (currentReaction) {
			if (currentReaction.type == 'like') {
				comment.likes--;
			} else {
				comment.dislikes--;
			}
			if (currentReaction.type == reaction) {
				await this.reactionRepository.remove(currentReaction);
			} else {
				if (reaction == 'like') {
					comment.likes++;
				} else {
					comment.dislikes++;
				}
				currentReaction.type = reaction;
				await this.reactionRepository.save(currentReaction);
			}
		} else {
			const newReaction = new CommentReaction();
			newReaction.comment = comment;
			newReaction.user = user;
			newReaction.type = reaction;
			if (reaction == 'like') {
				comment.likes++;
			} else {
				comment.dislikes++;
			}
			await this.reactionRepository.save(newReaction);
		}
		return await this.commentRepository.save(comment);
	}

	async editComment(comment: Comment, updateCommentDto: UpdateCommentDTO){
		comment.content = updateCommentDto.content;
		comment.edited = true;
		return await this.commentRepository.save(comment);
	}
	async deleteComment(comment: Comment){
		return await this.commentRepository.remove(comment);
	}
}