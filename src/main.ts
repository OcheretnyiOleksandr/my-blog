import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swagger(app);

  await app.listen(3000);
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
