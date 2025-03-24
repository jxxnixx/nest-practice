// main.ts
// - simply start up our HTTP listener, which lets the application await inbound HTTP requests

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GameModule } from './game/game.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cafe Menu Game API')
    .setDescription('Cafe Menu Game API description')
    .setVersion('1.0')
    .addTag('cafe-menu-game')
    .build();

  // Swagger 문서를 생성할 때 사용할 옵션 (예: 특정 모듈만 포함)
  const documentOptions = {
    include: [GameModule], // 필요시 모듈 배열 입력
    deepScanRoutes: true,
    autoTagControllers: true,
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);

  const fixedCustomOptions = {
    useGlobalPrefix: true,
    ui: true,
    raw: ['json'] as ('json' | 'yaml')[],
    jsonDocumentUrl: 'api-json',
    customSiteTitle: 'My Awesome API Docs',
    customCss: '.swagger-ui .topbar { background-color: hotpink; }',
  };

  SwaggerModule.setup('docs', app, document, fixedCustomOptions);

  // CORS 활성화
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

// NestFactory
// - exposes a few static methods that allow creating an application instance

// create()
// - returns an application object, which fulfills the INestApplication interface
