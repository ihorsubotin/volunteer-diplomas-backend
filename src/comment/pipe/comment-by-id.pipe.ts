import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CommentService } from '../comment.service';

@Injectable()
export class CommentByIdPipe implements PipeTransform<string, Promise<any>> {
	constructor(private readonly commentService: CommentService) {}

	async transform(commentId: string) {
		const event = await this.commentService.getCommentById(commentId);
		if (!event) {
			throw new NotFoundException(`Comment with ID "${commentId}" not found`);
		}
		return event;
	}
}
