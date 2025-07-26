import { Injectable } from '@nestjs/common';
import { NatsService } from 'src/services/nats.service';
import { EmailRequestDTO } from 'src/models/dtos/EmailRequestDTO';

@Injectable()
export class EmailServer {
  constructor() {}

  async initialize() {
    const { nc } = await this.createEmailStream();
    const { nc: nc2 } = await this.consumeFromEmailStream();
    console.log('Email server initialized and listening for email requests.');
    return { nc, nc2 };
  }

  async createEmailStream() {
    const streamName = 'email';
    const subjects = ['email.*'];

    try {
      const { nc, js, jsm } = await NatsService.createConnection();
      await NatsService.createStream(jsm, streamName, subjects);
      await NatsService.closeConnection(nc);
      return { nc };
    } catch (error) {
      console.error('Error creating stream:', error);
      throw error;
    }
  }

  async consumeFromEmailStream() {
    const streamName = 'email';
    const consumerName = 'email-consumer';

    try {
      const { nc, js, jsm } = await NatsService.createConnection();
      await NatsService.consumeFromStream<EmailRequestDTO>(
        nc,
        js,
        jsm,
        streamName,
        consumerName,
        async (msg) => {
          const email: EmailRequestDTO = msg;
          console.log('Processing email request:', email);
        },
      );
      return { nc };
    } catch (error) {
      console.error('Error subscribing to email stream:', error);
      throw error;
    }
  }
}
