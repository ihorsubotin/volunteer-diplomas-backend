import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateDto } from './dto/create-update.dto';
import { Update } from '../entities/update.entity'
import { Repository } from 'typeorm';


@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(Update)
    private updateRepository: Repository<Update>
  ){}

  create(createUpdateDto: CreateUpdateDto) {
    return 'This action adds a new update';
  }

  findUnseen() {
   	const unseen = this.updateRepository.find({
      where:{
        seen: false
      },
      relations: {
        connection: true,
      },
      order: {
        id: 'ASC',
      },
      take: 10
    })
    return unseen;
  }

  findOne(id: number) {
    return `This action returns a #${id} update`;
  }

  update(id: number) {
    return `This action updates a #${id} update`;
  }

  remove(id: number) {
    return `This action removes a #${id} update`;
  }
}
