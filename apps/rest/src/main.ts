import { NestFactory } from '@nestjs/core';
import { RestModule } from './rest.module';

async function bootstrap() {
  const app = await NestFactory.create(RestModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
