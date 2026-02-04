import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan'; // ✅ Use default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Add this line to log every request (GET, POST, etc.)
  app.use(morgan('dev')); 

 // src/main.ts
app.enableCors({
  origin: true, // This allows ANY origin to connect (Good for testing)
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
});

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Backend running on port ${process.env.PORT || 3000}`);
}
bootstrap();