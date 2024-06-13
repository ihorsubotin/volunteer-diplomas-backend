import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDTO from './dto/createUserDTO';
import { IsLoggedIn } from '../auth/guards/loggedIn.guard';
import { IsAdmin } from '../auth/guards/admin.guard';
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
	async getUser(@Req() req, @Param('id') id: string){
		if(id == 'me'){
			id = req.user.id;
		}
		if(req.user.isAdmin || (id && req.user.id == id)){
			const user =  await this.userService.getExtendedUserById(+id);
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
	async changePassword(@Param('id') id: string, @Body() newPassword, @Req() req){
		if(id == 'me'){
			id = req.user.id;
		}
		if(req.user.isAdmin || (id && req.user.id == id)){
			if(newPassword?.password){
				const success = this.userService.updatePassword(+id, newPassword.password);
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
	async updateUser(@Param('id') id: string, @Body() userDTO: UpdateUserDTO, @Req() req){
		if(id == 'me'){
			id = req.user.id;
		}
		if(!+id){
			throw new NotFoundException();
		}
		if(req.user.isAdmin || (id && req.user.id == id)){
			const user = await this.userService.updateUser(+id, userDTO);
			if(!user){
				throw new NotFoundException();
			}
			return user;
		}
		throw new UnauthorizedException();
	}

	@UseGuards(IsAdmin)
	@Delete(':id')
	async deleteUser(@Param('id') id: string,  @Req() req){
		if(id == 'me'){
			id = req.user.id;
		}
		if(id && req.user.id == id){
			throw new ForbiddenException("You can't delete yourself");
		}

		const success = await this.userService.deleteUser(+id);
		if(success){
			return 'Deleted succesfully!';
		}else{
			throw new NotFoundException();
		}
	}
}
