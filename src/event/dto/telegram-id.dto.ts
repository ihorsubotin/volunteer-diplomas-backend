import { IsNotEmpty } from "class-validator";

export class FindWithTelegramId {
	@IsNotEmpty()
	telegramId: string;
}
