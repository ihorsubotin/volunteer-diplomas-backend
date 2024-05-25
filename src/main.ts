import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
	origin: configService.get("ALLOW_ORIGIN"),
	credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60 * 60 * 1000 }
  }));
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  await app.listen(configService.get("PORT"));
}
bootstrap();
