import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import CreateUserDTO from './dto/createUserDTO';
import { IsLoggedIn } from 'src/auth/guards/loggedIn.guard';
import { IsAdmin } from 'src/auth/guards/admin.guard';
import UpdateUserDTO from './dto/updateUserDTO';



@Controller('user')
export class UserController {

	constructor(
		private userService: UserService
	){}

	@Get()
	getAll(){
		return this.userService.findAll();
	}

	@UseGuards(IsLoggedIn)
	@Get(':id')
	async getUser(@Req() req, @Param() params: any){
		if(params?.id == 'me'){
			params.id = req.user.id;
		}
		if(req.user.isAdmin || (params.id && req.user.id == params.id)){
			const user =  await this.userService.getExtendedUserById(params.id);
			if(user){
				return user;
			}else{
				throw new NotFoundException();
			}
		}
		throw new UnauthorizedException();		
	}

	@UseGuards(IsAdmin)
	@Post()
	createUser(@Body() userDTO: CreateUserDTO){
		return this.userService.createUser(userDTO);
	}

	@UseGuards(IsLoggedIn)
	@Patch('password/:id')
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

	@UseGuards(IsLoggedIn)
	@Patch(':id')
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

	@UseGuards(IsAdmin)
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
