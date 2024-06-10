import { IsNotEmpty } from "class-validator";

export class CreateActivityCategoryDto {
	@IsNotEmpty()
	name: string;
}
