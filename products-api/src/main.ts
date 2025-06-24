import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validação global dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove dados que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro se enviar algo fora do DTO
      transform: true, // Faz conversão automática (ex.: string -> number)
    }),
  );

  await app.listen(3000);
  console.log('🚀 Application is running on: http://localhost:3000');
}
bootstrap();
