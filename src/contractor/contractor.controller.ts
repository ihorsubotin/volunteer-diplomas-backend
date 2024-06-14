import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { IsLoggedIn } from 'src/auth/guards/loggedIn.guard';
import { UserService } from 'src/user/user.service';

@Controller('contractor')
export class ContractorController {
	constructor(
		private readonly contractorService: ContractorService,
		private userService: UserService
	) { }

	@UseGuards(IsLoggedIn)
	@Post()
	async create(@Body() createContractorDto: CreateContractorDto, @Req() req) {
		if (req.user.contractor) {
			return new BadRequestException('Contractor is already defined');
		}
		const contractor = await this.contractorService.create(createContractorDto, req.user);
		const updatedUser = await this.userService.getExtendedUserById(req.user.id);
		req.session.user = updatedUser;
		return contractor;
	}

	@UseGuards(IsLoggedIn)
	@Get(':id')
	async findOne(@Param('id') id: string, @Req() req) {
		if (req.user && req.user.contractor && id == 'me') {
			id = req.user.contractor.id;
		}
		if (req.user.isAdmin || (req.user?.contractor?.id == id)) {
			const contractor = await this.contractorService.findFullContractor(+id);
			if(!contractor){
				throw new NotFoundException();
			}
			return contractor;
		}
		throw new UnauthorizedException();
	}

	@UseGuards(IsLoggedIn)
	@Patch(':id')
	async update(@Param('id') id: string, @Req() req, @Body() updateContractorDto: UpdateContractorDto) {
		if (req.user && req.user.contractor && id == 'me') {
			id = req.user.contractor.id;
		}
		if (req.user.isAdmin || (req.user?.contractor?.id == id)) {
			const contractor = await this.contractorService.update(+id, updateContractorDto);
			if(!contractor){
				throw new NotFoundException();
			}
			return contractor;
		}
		throw new UnauthorizedException();
	}
}
