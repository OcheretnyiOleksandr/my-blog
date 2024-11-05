import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const applicationConfig = app.get(ConfigService);

  app.use(cookieParser());

  swagger(app);

  await app.listen(applicationConfig.get('APP_PORT'));
}

const swagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('Article Blog')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
};

bootstrap();
