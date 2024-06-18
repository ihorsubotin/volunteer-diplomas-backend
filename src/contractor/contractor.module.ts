import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor } from 'src/entities/contractor.entity';
import { ActivityCategoryModule } from 'src/activity-category/activity-category.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contractor]), ActivityCategoryModule, UserModule],
  controllers: [ContractorController],
  providers: [ContractorService],
  exports: [ContractorService]
})
export class ContractorModule {}
