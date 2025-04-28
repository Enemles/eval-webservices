// apps/service-grpc/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notifications',
        protoPath: process.cwd() + '/libs/shared/src/proto/service.proto',
        url: '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
  console.log('gRPC microservice is listening on port 50051');
}
bootstrap();
