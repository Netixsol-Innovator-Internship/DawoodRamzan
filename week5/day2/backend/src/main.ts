import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://dawood-week5-day2-3-frontend.vercel.app',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
}
bootstrap();
