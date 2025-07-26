import { Module } from '@nestjs/common';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { MailchimpProvider } from './providers/mailchamp.provider';
import { EmailjsProvider } from './providers/emailjs.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INJECTION_TOKENS } from './constants/injection-tokens';
import { NatsService } from './services/nats.service';
import { EmailServer } from './servers/EmailServer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: INJECTION_TOKENS.EMAIL_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('EMAIL_PROVIDER');
        switch (provider) {
          case 'emailjs':
            return new EmailjsProvider();
          case 'mailchimp':
          default:
            return new MailchimpProvider();
        }
      },
      inject: [ConfigService],
    },
    NatsService,
    EmailServer
  ]
})
export class AppModule {}
