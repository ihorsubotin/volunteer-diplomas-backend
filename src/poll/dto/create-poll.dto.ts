import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsString, Length } from "class-validator";

export class CreatePollDto {
	@IsString()
	@Length(3, 255)
	title: string;
	@IsArray()
	@ArrayMinSize(2)
	@ArrayMaxSize(10)
	@IsString({each: true})
	@Length(3, 255, {each: true})
	questions: string[];
}
