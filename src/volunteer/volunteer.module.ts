import { Module } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from '../entities/volunteer.entity';
import { UserModule } from '../user/user.module';
import { ActivityCategoryModule } from '../activity-category/activity-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Volunteer]), UserModule, ActivityCategoryModule],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}
