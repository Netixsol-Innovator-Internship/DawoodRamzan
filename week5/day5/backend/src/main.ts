import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your frontend
  app.enableCors({
    origin: 'http://localhost:3001', // Next.js dev URL
    credentials: true,
  });

  // Attach Socket.IO adapter explicitly
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(4000);
  console.log('NestJS running on http://localhost:4000');
}
bootstrap();
