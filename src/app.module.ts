import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { TelegramController } from './telegram/telegram.controller';
import { TelegramModule } from './telegram/telegram.module';
import { UpdateModule } from './update/update.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { EventModule } from './event/event.module';


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
	AuthModule,
	TelegramModule,
	UpdateModule,
	VolunteerModule,
	EventModule
  ],
  providers: [AppService],
})
export class AppModule {}
