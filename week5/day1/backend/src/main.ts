import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://dawood-week5-day1-frotnend.vercel.app/', // your frontend URL
    credentials: true, // if you need cookies/headers
  });

  app.setGlobalPrefix('api');

  await app.listen(4000);
  console.log(`🚀 HTTP & Socket.IO server running on http://localhost:4000`);
}
bootstrap();
