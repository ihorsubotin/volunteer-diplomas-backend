import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { EventModule } from 'src/event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CommentReaction } from 'src/entities/comment-reaction.entity';

@Module({
	imports: [EventModule, TypeOrmModule.forFeature([Comment, CommentReaction])],
	providers: [CommentService],
	controllers: [CommentController],
})
export class CommentModule {}
