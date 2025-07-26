import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NatsConfig } from './configs/nats.config';
import { WebConfig } from './configs/web.config';
import { EmailServer } from './servers/EmailServer';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [NatsConfig.natsUrl],
      },
    },
  );

  // Enable validation for microservice
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();

  const webApp = await NestFactory.create(AppModule);

  // Enable validation for web app
  webApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await webApp.listen(WebConfig.port);

  const emailServer = webApp.get(EmailServer);
  const { nc, nc2 } = await emailServer.initialize();
  if(!nc || !nc2) {
    console.error('Failed to initialize NATS connections');
    return;
  }

  console.log(
    'Microservice is listening on port',
    NatsConfig.port,
    'HTTP server is listening on port',
    WebConfig.port,
    'NATS connection established',
  );
}
bootstrap();
