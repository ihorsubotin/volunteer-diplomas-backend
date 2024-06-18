import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateAccountDto{
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	region: string;
	@IsArray()
	@IsNumber({},{each: true})
	activities: number[];
	@IsNotEmpty()
	userInfo: string;
	@IsNotEmpty()
	telegramUser: string;
}