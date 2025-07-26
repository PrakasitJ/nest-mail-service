export class WebConfig {
  static get address() {
    return process.env.WEB_ADDRESS || 'localhost';
  }

  static get port() {
    return process.env.WEB_PORT || '3001';
  }

  static get webURL() {
    return `http://${this.address}:${this.port}`;
  }

  static get webURLSecure() {
    return `https://${this.address}:${this.port}`;
  }
}
