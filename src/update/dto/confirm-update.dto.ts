import { IsArray, IsNumber } from "class-validator";

export class ConfirmUpdateDTO{
	@IsArray()
	@IsNumber({},{each: true})
	confirmed: number[];
}