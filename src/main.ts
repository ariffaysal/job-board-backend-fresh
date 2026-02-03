import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your frontend can call backend
  app.enableCors({
    origin: ['https://front-end-gold-five.vercel.app'], // ✅ your deployed frontend URL
    credentials: true, // keep if you’re using cookies or auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Backend running on port ${process.env.PORT || 3000}`);
}
bootstrap();