import { IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateEventDto {
	@Length(3, 255)
	@IsString()
	name: string;

	@Length(3, 10000)
	@IsString()
	description: string;

	@Length(3, 255)
	@IsString()
	status: string;

	@IsOptional()
	@Length(3, 255)
	@IsString()
	location: string;

	@IsDateString()
	date: Date;

	@IsOptional()
	@IsNumber()
	previousEvent: number;

	@IsArray()
	@IsNumber({},{each: true})
	activities: number[];
}
