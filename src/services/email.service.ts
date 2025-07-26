import { Injectable, Inject } from '@nestjs/common';
import { IEmailProvider } from 'src/models/interfaces/IEmailProvider';
import { INJECTION_TOKENS } from 'src/constants/injection-tokens';

@Injectable()
export class EmailService {
  constructor(
    @Inject(INJECTION_TOKENS.EMAIL_PROVIDER) private readonly emailProvider: IEmailProvider
  ) {}
  
  sendEmail(email: string): string {
    return this.emailProvider.sendEmail(email);
  }
}
