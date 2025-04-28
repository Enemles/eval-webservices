import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GqlAuthGuard } from '@app/shared/auth/graphql-auth.guard';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('GraphQLAPI');
  const app = await NestFactory.create(AppModule);
  
  // Appliquer le GqlAuthGuard globalement pour toutes les requêtes
  const gqlAuthGuard = app.get(GqlAuthGuard);
  app.useGlobalGuards(gqlAuthGuard);
  
  // Ajouter un pipe de validation global
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`API GraphQL démarrée sur le port ${port}`);
}
bootstrap();
