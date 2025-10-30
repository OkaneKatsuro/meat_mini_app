import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import express, { Express, Request, Response } from 'express';

const server = express();

const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Meat Warehouse API')
    .setDescription('API for meat warehouse management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  return app;
};

let appPromise: Promise<any> | null = null;

export default async (req: Request, res: Response) => {
  if (!appPromise) {
    appPromise = createNestServer(server);
  }
  await appPromise;
  return server(req, res);
};
