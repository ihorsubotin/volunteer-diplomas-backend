import { IsString, Length } from 'class-validator';

export class UpdateCommentDTO {
	@IsString()
	@Length(3, 2000)
	content: string;
}
