import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor } from 'src/entities/contractor.entity';
import { ActivityCategoryModule } from 'src/activity-category/activity-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contractor]), ActivityCategoryModule],
  controllers: [ContractorController],
  providers: [ContractorService],
})
export class ContractorModule {}
