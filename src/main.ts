import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
=======
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
>>>>>>> c7bc55ee0b53ad27d9bb77a1e5f8b3c70fd42a2a
    credentials: true,
  });

  // Validation Pipe Global
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Uzum Market Clone API')
    .setDescription('The API description for Uzum Market Clone')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger UI is available at: http://localhost:${port}/api/docs`);
}
void bootstrap();
