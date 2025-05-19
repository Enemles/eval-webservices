// apps/service-grpc/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: join(
          __dirname,
          '../../..',
          'libs/shared/src/proto/service.proto'
        ),
        url: process.env.GRPC_URL || 'localhost:5000',
      },
    },
  );
  await app.listen();
  console.log('gRPC microservice is listening on port 5000');
}

bootstrap().catch(err => {
  console.error('Erreur de démarrage:', err);
  process.exit(1);
});
