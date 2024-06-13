import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UpdateService } from './update.service';
import { IsTelegram } from '../auth/guards/telegram.guard';
import { ConfirmUpdateDTO } from './dto/confirm-update.dto';

@Controller('update')
export class UpdateController {
	constructor(private readonly updateService: UpdateService) { }

	//   @Post()
	//   create(@Body() createUpdateDto: CreateUpdateDto) {
	//     return this.updateService.create(createUpdateDto);
	//   }

	@UseGuards(IsTelegram)
	@Get('new')
	getNewUpdates() {
		return this.updateService.findUnseen();
	}
	@UseGuards(IsTelegram)
	@Patch('seen')
	confirmUpdate(@Body() body: ConfirmUpdateDTO){
		return this.updateService.confirmViews(body.confirmed);
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
