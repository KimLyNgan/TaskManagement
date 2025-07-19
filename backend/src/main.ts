import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Accept, Authorization',
  // });
  app.enableCors({
    origin: 'http://localhost:3000', // Đảm bảo đúng origin của frontend Next.js
    credentials: true, // CỰC KỲ QUAN TRỌNG: Cho phép gửi/nhận cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Các phương thức HTTP được cho phép
    allowedHeaders: 'Content-Type, Accept, Authorization', // Các headers được cho phép
  });

  app.use(cookieParser(process.env.COOKIE_SECRET));

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
}
bootstrap();
