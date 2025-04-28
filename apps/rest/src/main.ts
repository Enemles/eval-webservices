//import { config } from 'dotenv';
//config({ path: './apps/rest/.env' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function bootstrap() {
  // Charger les variables d'environnement
  const envPath = path.resolve(process.cwd(), 'apps/rest/.env');
  console.log(`Chargement des variables d'environnement depuis: ${envPath}`);
  dotenv.config({ path: envPath });
  
  // Afficher les variables pour débogage
  console.log('MINIO_ENDPOINT:', process.env.MINIO_ENDPOINT);
  console.log('MINIO_PORT:', process.env.MINIO_PORT);
  console.log('MINIO_ROOT_USER:', process.env.MINIO_ROOT_USER);
  
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // Configuration Swagger pour l'API REST
  const config = new DocumentBuilder()
    .setTitle('Plateforme de réservation de salles')
    .setDescription('API REST pour réservation de salles')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();

  await app.listen(3000);
  console.log('Application démarrée sur le port 3000');
}
void bootstrap();
