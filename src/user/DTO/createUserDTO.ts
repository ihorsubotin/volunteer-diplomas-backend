import { Allow, IsEmail, IsNotEmpty } from "class-validator";

export default class CreateUserDTO{
	@IsNotEmpty()
	firstName: string;
	@IsNotEmpty()
	lastName: string;
	@IsEmail()
	email: string;
	@IsNotEmpty()
	password: string;
	@Allow()
	region:string;
}