import { ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class IsTelegram{
	constructor (private config: ConfigService){}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		return req.get('Authorization') === this.config.get('TELEGRAM_SECRET');
	}
}