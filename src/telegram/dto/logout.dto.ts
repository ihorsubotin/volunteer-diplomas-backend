import { IsNotEmpty } from "class-validator";

export class TelegramUserDto{
	@IsNotEmpty()
	telegramUser:string;
}