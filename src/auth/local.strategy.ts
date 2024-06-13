import { Injectable, UnauthorizedException, CanActivate, ExecutionContext} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class LoginStrategy implements CanActivate {
	constructor(private authService: AuthService){}
	async canActivate(context: ExecutionContext):Promise<boolean> {
		let user;
		const req = context.switchToHttp().getRequest();
		try{
			let body = await req.json();
			user = await this.authService.validateUser(body.email, body.passpord);
		}catch(err){
			throw new UnauthorizedException();
		}
		if(!user){
			throw new UnauthorizedException();
		}
		req.user = user;
		return true;
	}
}