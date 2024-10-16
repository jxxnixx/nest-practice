// main.ts
// - simply start up our HTTP listener, which lets the application await inbound HTTP requests

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// NestFactory
// - exposes a few static methods that allow creating an application instance

// create()
// - returns an application object, which fulfills the INestApplication interface
