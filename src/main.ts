import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan'; // ✅ Use default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Add this line to log every request (GET, POST, etc.)
  app.use(morgan('dev')); 

  app.enableCors({
    origin: ['https://front-end-gold-five.vercel.app'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Backend running on port ${process.env.PORT || 3000}`);
}
bootstrap();