import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';
import { UpdateModule } from './update/update.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { EventModule } from './event/event.module';
import { ActivityCategoryModule } from './activity-category/activity-category.module';
import { ContractorModule } from './contractor/contractor.module';
import { CommentModule } from './comment/comment.module';
import { PollModule } from './poll/poll.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DATABASE_HOST'),
				port: +configService.get('DATABASE_PORT'),
				username: configService.get('DATABASE_USERNAME'),
				password: configService.get('DATABASE_PASSWORD'),
				database: configService.get('DATABASE_NAME'),
				autoLoadEntities: true,
				synchronize: true,
			}),
			dataSourceFactory: async (options) => {
				const dataSource = await new DataSource(options).initialize();
				return dataSource;
			},
		}),
		ScheduleModule.forRoot(),
		AuthModule,
		TelegramModule,
		UpdateModule,
		VolunteerModule,
		EventModule,
		ActivityCategoryModule,
		ContractorModule,
		CommentModule,
		PollModule,
	],
	providers: [AppService],
})
export class AppModule {}
