export interface IEmailProvider {
  sendEmail(email: string): string;
}
