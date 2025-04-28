//import { config } from 'dotenv';
//config({ path: './apps/rest/.env' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { JwtAuthGuard } from '@app/shared/auth/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Charger les variables d'environnement
  const envPath = path.resolve(process.cwd(), 'apps/rest/.env');
  console.log(`Chargement des variables d'environnement depuis: ${envPath}`);
  dotenv.config({ path: envPath });
  
  // Afficher les variables pour débogage
  console.log('KEYCLOAK_URL:', process.env.KEYCLOAK_URL);
  console.log('KEYCLOAK_REALM:', process.env.KEYCLOAK_REALM);
  console.log('KEYCLOAK_CLIENT_ID:', process.env.KEYCLOAK_CLIENT_ID);
  
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  
  // Appliquer le JwtAuthGuard globalement pour toutes les routes
  const jwtAuthGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(jwtAuthGuard);
  
  // Ajouter un pipe de validation global
  app.useGlobalPipes(new ValidationPipe());

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
