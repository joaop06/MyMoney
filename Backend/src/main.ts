import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from 'interceptors/all-exception-filter';
import { FindOptionsMiddleware } from 'middlewares/find-options.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Valida automaticamente os DTOs
   */
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  /**
   * Aplica o middleware globalmente em todas as rotas
   */
  app.use((req: Request, res: Response, next: NextFunction) => new FindOptionsMiddleware().use(req, res, next))

  /**
   * Configuração do Swagger (Documentação)
   */
  const config = new DocumentBuilder()
    .setTitle('API MyMoney')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   * Filtro de Exceções Http
   */
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(3000);
}
bootstrap();
