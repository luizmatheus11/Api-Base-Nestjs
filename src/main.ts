import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Ng.Cash')
    .setDescription('The NgCash description API')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Bearer',
    )
    .setVersion('1.0')
    .addTag('users')
    .addTag('transactions')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  
  const prismaService = app.get(PrismaService);
  
  await prismaService.enableShutdownHooks(app)

  console.log('Port', process.env.PORT || 3000);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
