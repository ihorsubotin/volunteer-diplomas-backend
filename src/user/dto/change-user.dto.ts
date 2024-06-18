import { Allow, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export default class CreateUserDTO{
	@IsNotEmpty()
	firstName: string;
	@IsNotEmpty()
	lastName: string;
	@IsEmail()
	email: string;
	@IsNotEmpty()
	password: string;
	@IsNotEmpty()
	region:string;
	@IsOptional()
	@IsNotEmpty()
	token: string;
}