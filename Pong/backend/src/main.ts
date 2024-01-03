import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('secrets/private-key.pem'),
    cert: fs.readFileSync('secrets/public-certificate.pem'),
  };

  const app = await NestFactory.create(
    AppModule,
    { httpsOptions },
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
      }
    }),
    cookieParser(),
  );
  await app.listen(3000);
}
bootstrap();