import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { EventByIdPipe } from '../event/pipe/event-by-id.pipe';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { IsLoggedIn } from 'src/auth/guards/loggedIn.guard';
import { Entity } from 'typeorm';
import { CommentByIdPipe } from './pipe/comment-by-id.pipe';
import { Comment } from 'src/entities/comment.entity';
import { UpdateCommentDTO } from './dto/update-comment.dto';

@Controller('events/:eventId/comment')
export class CommentController {
	constructor(private commentService: CommentService) {}
	@Get()
	async findAll(@Param('eventId', EventByIdPipe) event: any, @Req() req) {
		return await this.commentService.getAllCommentsOnEvent(
			event.id,
			req.session.user,
		);
	}

	@UseGuards(IsLoggedIn)
	@Post()
	async createComment(
		@Param('eventId', EventByIdPipe) event: any,
		@Body() createCommentDTO: CreateCommentDTO,
		@Req() req: any,
	) {
		const comment = await this.commentService.createComment(
			createCommentDTO,
			event,
			req.user,
		);
		return comment;
	}

	@UseGuards(IsLoggedIn)
	@Post(':id/like')
	async likeComment(
		@Param('id', CommentByIdPipe) comment: Comment,
		@Req() req: any,
	) {
		return await this.commentService.setReaction(comment, req.user, 'like');
	}

	@UseGuards(IsLoggedIn)
	@Post(':id/dislike')
	async dislikeComment(
		@Param('id', CommentByIdPipe) comment: Comment,
		@Req() req: any,
	) {
		return await this.commentService.setReaction(comment, req.user, 'dislike');
	}

	@UseGuards(IsLoggedIn)
	@Delete(':id')
	async deleteComment(
		@Param('id', CommentByIdPipe) comment: Comment,
		@Req() req: any,
	){
		const user = await this.commentService.getCommentAuthor(comment);
		if(user.id == req.user.id){
			return await this.commentService.deleteComment(comment);
		}else{
			throw new UnauthorizedException('You can only remove your comments');
		}
	}

	@UseGuards(IsLoggedIn)
	@Patch(':id')
	async editComment(
		@Body() updateCommentDto: UpdateCommentDTO,
		@Param('id', CommentByIdPipe) comment: Comment,
		@Req() req: any,
	){
		const user = await this.commentService.getCommentAuthor(comment);
		if(user.id == req.user.id){
			return await this.commentService.editComment(comment, updateCommentDto);
		}else{
			throw new UnauthorizedException('You can edit only your comments');
		}
	}
}
