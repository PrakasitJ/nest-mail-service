import { IEmailProvider } from 'src/models/interfaces/IEmailProvider';

export class MailchimpProvider implements IEmailProvider {
  sendEmail(email: string): string {
    // Implementation for sending email using Mailchimp
    return `Email sent to ${email} using Mailchimp`;
  }
}