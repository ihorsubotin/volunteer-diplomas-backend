import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { UpdateService } from './update.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { IsTelegram } from 'src/auth/guards/telegram.guard';

@Controller('update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Post()
  create(@Body() createUpdateDto: CreateUpdateDto) {
    return this.updateService.create(createUpdateDto);
  }

  @UseGuards(IsTelegram)
  @Get('new')
  getNewUpdates() {
    return this.updateService.findUnseen();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.updateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.updateService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.updateService.remove(+id);
  }
}
