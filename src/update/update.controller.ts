import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
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
	getNewUpdates() {
		return this.updateService.findUnseenTelegram();
	}
	
	@UseGuards(IsTelegram)
	@Patch('seen')
	confirmUpdate(@Body() body: ConfirmUpdateDTO){
		return this.updateService.confirmViewsTelegram(body.confirmed);
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
