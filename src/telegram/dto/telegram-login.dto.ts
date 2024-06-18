import { IsNotEmpty } from "class-validator";

export class LoginDTO{
	@IsNotEmpty()
	token: string;
	@IsNotEmpty()
	userInfo: string;
	@IsNotEmpty()
	telegramUser: string;
}