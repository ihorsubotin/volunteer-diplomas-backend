import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateService } from './update.service';
import { IsTelegram } from '../auth/guards/telegram.guard';
import { ConfirmUpdateDTO } from './dto/confirm-update.dto';
import { IsLoggedIn } from 'src/auth/guards/loggedIn.guard';

@Controller('update')
export class UpdateController {
	constructor(private readonly updateService: UpdateService) { }

	//   @Post()
	//   create(@Body() createUpdateDto: CreateUpdateDto) {
	//     return this.updateService.create(createUpdateDto);
	//   }

	@UseGuards(IsLoggedIn)
	@Get('my/:page')
	getMyUpdates(@Param('page', ParseIntPipe) page: number, @Req() req) {
		if (isNaN(page) || page <= 0) {
			page = 0;
		}
		return this.updateService.getBrowserNotifications(page, req.user);
	}

	@UseGuards(IsTelegram)
	@Get('new')
	getNewTelegramUpdates() {
		return this.updateService.findUnseenTelegram();
	}
	
	@UseGuards(IsTelegram)
	@Patch('seen')
	async confirmTelegramUpdate(@Body() body: ConfirmUpdateDTO){
		return await this.updateService.confirmViewsTelegram(body.confirmed);
	}

	@UseGuards(IsLoggedIn)
	@Patch('my/:id')
	async confirmBrowserUpdate(@Param('id', ParseIntPipe) id: number, @Req() req){
		const update = await this.updateService.findOneBrowserUpdate(id);
		if(!update){
			throw new NotFoundException();
		}
		if(update.user.id == req.user.id){
			return await this.updateService.confirmViewsBrowser(id);
		}
		throw new UnauthorizedException();
	}

	//   @Get(':id')
	//   findOne(@Param('id') id: string) {
	//     return this.updateService.findOne(+id);
	//   }

	//   @Patch(':id')
	//   update(@Param('id') id: string) {
	//     return this.updateService.update(+id);
	//   }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.updateService.remove(+id);
	// }
}
