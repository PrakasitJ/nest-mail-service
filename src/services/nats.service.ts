import {
  AckPolicy,
  connect,
  DeliverPolicy,
  DiscardPolicy,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  PubAck,
  RetentionPolicy,
  StorageType,
  StreamConfig,
  StringCodec,
} from 'nats';
import { Injectable, Logger } from '@nestjs/common';
import { NatsConfig } from 'src/configs/nats.config';

@Injectable()
export class NatsService {
  private static readonly logger = new Logger(NatsService.name);

  constructor() {}

  public static async createConnection(): Promise<{
    nc: NatsConnection;
    js: JetStreamClient;
    jsm: JetStreamManager;
  }> {
    const nc: NatsConnection = await connect({
      servers: [NatsConfig.natsUrl],
    });
    NatsService.logger.log('Connected to NATS server');
    const js: JetStreamClient = nc.jetstream();
    const jsm: JetStreamManager = await nc.jetstreamManager();
    return { nc, js, jsm };
  }

  public static async createStream(
    jsm: JetStreamManager,
    streamName: string,
    subjects: string[],
  ): Promise<void> {
    try {
      const streamConfig: Partial<StreamConfig> = {
        name: streamName,
        subjects: subjects,
        storage: StorageType.Memory, // or StorageType.File for persistent storage
        retention: RetentionPolicy.Limits, // RetentionPolicy.Limits or RetentionPolicy.WorkQueue
        max_age: 24 * 60 * 60 * 1000000000, // 24 hours in nanoseconds
        max_msgs: 1000, // maximum number of messages
        max_bytes: 10 * 1024 * 1024, // maximum size of the stream
        discard: DiscardPolicy.Old, // DiscardPolicy.New or DiscardPolicy.Old
      };

      await jsm.streams.add(streamConfig);
      NatsService.logger.log(
        `Stream ${streamName} created with subjects ${subjects.join(', ')}`,
      );
    } catch (error) {
      NatsService.logger.error(`Error creating stream ${streamName}:`, error);
      throw error;
    }
  }

  public static async publishToStream<T>(
    js: JetStreamClient,
    subject: string,
    payload: T,
  ): Promise<PubAck> {
    const ack = await js.publish(subject, JSON.stringify(payload));
    return ack;
  }

  public static async consumeFromStream<T>(
    nc: NatsConnection,
    js: JetStreamClient,
    jsm: JetStreamManager,
    streamName: string,
    consumerName: string,
    callback: (msg: T) => Promise<void>,
  ): Promise<void> {
    try {
      try {
        // Try to create consumer if it doesn't exist
        await jsm.consumers.add(streamName, {
          durable_name: consumerName,
          deliver_policy: DeliverPolicy.All,
          ack_policy: AckPolicy.Explicit,
        });
      } catch (error) {
        // Consumer might already exist, continue
        console.log(`Consumer ${consumerName} might already exist`);
      }

      // Get consumer
      const consumer = await js.consumers.get(streamName, consumerName);

      // Consume messages with timeout
      const messagesIter = await consumer.consume();

      let messageCount = 0;
      //   const maxMessages = 10; // Limit to prevent infinite loop

      for await (const msg of messagesIter) {
        // if (messageCount >= maxMessages) break;
        try {
          const data : T = JSON.parse(msg.data.toString());
          await callback(data);
          msg.ack();
          messageCount++;
        } catch (error) {
          console.error('Error processing message:', error);
          msg.nak();
        }
      }

      await nc.close();
    } catch (error) {
      console.error('Error consuming messages:', error);
      throw error;
    }
  }

  public static async closeConnection(nc: NatsConnection): Promise<void> {
    await nc.close();
    NatsService.logger.log('NATS connection closed');
  }
}