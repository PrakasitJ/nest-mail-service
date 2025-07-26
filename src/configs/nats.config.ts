export class NatsConfig {
  static get address() {
    return process.env.MICROSERVICE_ADDRESS || 'localhost';
  }

  static get port() {
    return process.env.MICROSERVICE_PORT || '4222';
  }

  static get natsUrl() {
    return `nats://${this.address}:${this.port}`;
  }
}
