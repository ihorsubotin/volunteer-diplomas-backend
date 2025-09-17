import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDTO {
	@IsString()
	@Length(3, 2000)
	content: string;
	@IsNumber()
	@IsOptional()
	replyTo: number;
}
