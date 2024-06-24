import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class FindEventDto {
	@IsOptional()	
	@Length(0, 255)
	@IsString()
	search: string;

	@IsOptional()
	@IsArray()
	@IsNumber({},{each: true})
	activities: number[];

	@IsOptional()
	@IsBoolean()
	finished: boolean;
}
