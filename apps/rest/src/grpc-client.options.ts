import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'api',
    protoPath: join(__dirname, '../../..', 'libs/shared/src/proto/service.proto'),
    url: process.env.GRPC_URL || 'localhost:5000',
  },
}; 