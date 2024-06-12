import { Allow, IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindVolunteerDto {
	@IsOptional()
	@IsString()
	organizationName: string;
	@IsOptional()
	@IsBoolean()
	isSolo: boolean;
	@IsOptional()
	@IsArray()
	@IsNumber({},{each: true})
	activities: number[];
}
