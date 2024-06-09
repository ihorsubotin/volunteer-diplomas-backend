import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IsLoggedIn } from "./loggedIn.guard";

@Injectable()
export class IsVolunteer extends IsLoggedIn{
	canActivate(context: ExecutionContext) {
		if(super.canActivate(context)){
			const req = context.switchToHttp().getRequest();
			if(req.user.volunteer){
				return true;
			}
		}
		return false;
	}
}