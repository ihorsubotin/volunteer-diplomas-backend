import { Type } from "class-transformer";
import { Allow, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Validate, ValidateNested } from "class-validator";
import { ActivityCategory } from "src/entities/activity-category.entity";

export class CreateVolunteerDto {
	@IsString()
	organizationName: string;
	@IsBoolean()
	isSolo: boolean;
	@IsArray()
	@IsNumber({},{each: true})
	activities: number[];
}
