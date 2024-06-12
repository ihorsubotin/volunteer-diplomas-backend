import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class UpdateUserDTO{
	@IsOptional()
	@IsNotEmpty()
	firstName: string;
	@IsOptional()
	@IsNotEmpty()
	lastName: string;
	@IsOptional()
	@IsEmail()
	email: string;
	@IsOptional()
	@IsString()
	region:string;
}