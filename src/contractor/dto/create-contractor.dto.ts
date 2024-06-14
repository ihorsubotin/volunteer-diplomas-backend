import { IsArray, IsNumber } from "class-validator";

export class CreateContractorDto {
    @IsArray()
	@IsNumber({},{each: true})
	activities: number[];
}
