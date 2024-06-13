import { IsArray, IsBoolean, IsNumber, IsString, Length, Validate, ValidateNested } from "class-validator";

export class CreateVolunteerDto {
	@Length(3, 255)
	@IsString()
	organizationName: string;
	@IsBoolean()
	isSolo: boolean;
	@IsArray()
	@IsNumber({},{each: true})
	activities: number[];
}
