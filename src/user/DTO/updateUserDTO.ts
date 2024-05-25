import { Allow, IsEmail, IsNotEmpty, ValidateIf} from "class-validator";
import * as ValidatorJS from 'validator';

export default class UpdateUserDTO{
	@Allow()
	firstName: string;
	@Allow()
	lastName: string;
	@ValidateIf(o=>{
		if(o.email == undefined) return true;
		return ValidatorJS.isEmail(o.email);
	})
	@Allow()
	email: string;
	@Allow()
	region:string;
}