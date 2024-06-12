import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { CreateVolunteerDto } from './create-volunteer.dto';

export class UpdateVolunteerDto extends PartialType(CreateVolunteerDto) {

}
