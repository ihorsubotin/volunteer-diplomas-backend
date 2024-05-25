import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import CreateUserDTO from './DTO/createUserDTO';
import { LoggedIn } from 'src/auth/guards/loggedIn.guard';
import { Admin } from 'src/auth/guards/admin.guard';
import UpdateUserDTO from './DTO/updateUserDTO';



@Controller('user')
export class UserController {

	constructor(
		private userService: UserService
	){}

	@Get()
	getAll(){
		return this.userService.findAll();
	}

	@UseGuards(LoggedIn)
	@Get(':id')
	async getMe(@Req() req, @Param() params: any){
		if(params?.id == 'me'){
			params.id = req.user.id;
		}
		if(req.user.isAdmin || (params.id && req.user.id == params.id)){
			const user =  await this.userService.findOneById(params.id);
			if(user){
				const {passwordHash, ...result} = user;
				return result;
			}else{
				throw new NotFoundException();
			}
		}
		throw new UnauthorizedException();		
	}

	@UseGuards(Admin)
	@Post()
	createUser(@Body() userDTO: CreateUserDTO){
		return this.userService.createUser(userDTO);
	}

	@UseGuards(LoggedIn)
	@Put('password/:id')
	async changePassword(@Param() params: any, @Body() newPassword, @Req() req){
		if(params?.id == 'me'){
			params.id = req.user.id;
		}
		if(req.user.isAdmin || (params.id && req.user.id == params.id)){
			if(newPassword?.password){
				const success = this.userService.updatePassword(params.id, newPassword.password);
				if(success){
					return 'Password changed!';
				}else{
					throw new NotFoundException();
				}
				
			}
		}
		throw new UnauthorizedException();
	}

	@UseGuards(LoggedIn)
	@Put(':id')
	async updateUser(@Param() params: any, @Body() userDTO: UpdateUserDTO, @Req() req){
		if(params?.id == 'me'){
			params.id = req.user.id;
		}
		if(req.user.isAdmin || (params.id && req.user.id == params.id)){
			const user = await this.userService.updateUser(params.id, userDTO);
			if(!user){
				throw new NotFoundException();
			}
			return user;
		}
		throw new UnauthorizedException();
	}

	@UseGuards(Admin)
	@Delete(':id')
	async deleteUser(@Param() params: any,  @Req() req){
		if(params?.id == 'me'){
			params.id = req.user.id;
		}
		if(params.id && req.user.id == params.id){
			throw new ForbiddenException("You can't delete yourself");
		}

		const success = await this.userService.deleteUser(params.id);
		if(success){
			return 'Deleted succesfully!';
		}else{
			throw new NotFoundException();
		}
	}
}
