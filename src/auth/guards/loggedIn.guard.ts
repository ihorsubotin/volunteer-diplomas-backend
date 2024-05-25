import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LoggedIn implements CanActivate{
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest();
		if(req.session.user){
			req.user = req.session.user;
			return true;
		}
		return false;
	}
}