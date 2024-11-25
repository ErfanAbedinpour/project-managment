import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Mini Github')
    .setDescription(`a mini github for manage better your project`)
    .setVersion('1.0')
    .addTag('project')
    .build();
  const docuementFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, docuementFactory);
  await app.listen(3000, () => console.log(`http://localhost:3000`));
}
bootstrap();
