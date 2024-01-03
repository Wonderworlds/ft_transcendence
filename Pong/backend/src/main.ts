import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as session from 'express-session';

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
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
      }
    }),
  );
  await app.listen(3000);
}
bootstrap();