import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
	origin: configService.get("ALLOW_ORIGIN"),
	credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  await app.listen(configService.get("PORT"));
}
bootstrap();
