import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan'; // Use default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Add this line to log every request (GET, POST, etc.)
  app.use(morgan('dev')); 

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Backend running on port ${process.env.PORT || 3000}`);
}
bootstrap();