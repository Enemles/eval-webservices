import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  await usersService.create({
    username: 'admin',
    keycloak_id: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    password: 'password'
  });
  console.log('Utilisateur initial créé.');
  await app.close();
}
bootstrap();