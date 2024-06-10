import { IsNotEmpty } from "class-validator";


export class UpdateActivityCategoryDto {
	@IsNotEmpty()
	name: string;
}
