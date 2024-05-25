import { ExecutionContext, Injectable } from "@nestjs/common";
import { LoggedIn } from "./loggedIn.guard";
import { Observable } from "rxjs";

@Injectable()
export class Admin extends LoggedIn{
	async canActivate(context: ExecutionContext): Promise<boolean> {
		if(super.canActivate(context)){
			const req = context.switchToHttp().getRequest();
			return req.user.isAdmin;
		}
	}
}