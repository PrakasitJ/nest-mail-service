import { IEmailProvider } from "src/models/interfaces/IEmailProvider";

export class EmailjsProvider implements IEmailProvider {
  sendEmail(email: string): string {
    // Implementation for sending email using EmailJS
    return `Email sent to ${email} using EmailJS`;
  }
}