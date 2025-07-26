import { Body, Controller, Logger, Param, Post, Query, Request, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DTO } from 'src/models/annotations/DTO';
import { EmailRequestDTO, EmailRequestQueryDTO } from 'src/models/dtos/EmailRequestDTO';
import { DocumentRequestDTO } from 'src/models/dtos/DocumentRequestDTO';
import { EmailService } from 'src/services/email.service';

@Controller('email')
export class EmailController {
  private static readonly logger = new Logger(EmailController.name);
  constructor(private readonly emailService: EmailService) {}

  @Post('send/:user_name')
  sendEmail(@DTO(EmailRequestDTO) emailRequestDTO: EmailRequestDTO): string {
    EmailController.logger.log('Received email request:', emailRequestDTO);
    return this.emailService.sendEmail(emailRequestDTO.email);
  }

  @Get('document/:document_id')
  getDocument(@DTO(DocumentRequestDTO) documentRequest: DocumentRequestDTO): any {
    EmailController.logger.log('Received document request:', documentRequest);
    return {
      documentId: documentRequest.documentId,
      userId: documentRequest.userId,
      fileType: documentRequest.fileType,
      status: documentRequest.status
    };
  }

  @MessagePattern('sendEmail')
  handleEmailRequest(@Payload() emailRequestDTO: EmailRequestDTO): string {
    EmailController.logger.log('Received email request:', emailRequestDTO);
    return this.emailService.sendEmail(emailRequestDTO.email);
  }
}
