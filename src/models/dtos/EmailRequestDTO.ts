import { IsString } from 'class-validator';
import { Body, Path, Query } from '../annotations/DTO';

export class EmailRequestDTO {
  @Body()
  @IsString({ message: 'Email must be a string' })
  email: string;

  @Body()
  @IsString({ message: 'To must be a string' })
  to: string;

  @Path('user_name')
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Query()
  @IsString({ message: 'Subject must be a string' })
  subject: string;

  @Query()
  @IsString({ message: 'Message must be a string' })
  message: string;
}

export class EmailRequestQueryDTO {
  @IsString({ message: 'Email must be a string' })
  email: string;

  @IsString({ message: 'Name must be a string' })
  name: string;
}

