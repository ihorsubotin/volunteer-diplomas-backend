import { ExecutionContext, Injectable } from "@nestjs/common";
import { IsLoggedIn } from "./loggedIn.guard";

@Injectable()
export class IsAdmin extends IsLoggedIn{
	async canActivate(context: ExecutionContext): Promise<boolean> {
		if(super.canActivate(context)){
			const req = context.switchToHttp().getRequest();
			return req.user.isAdmin;
		}
	}
}