import { IsString, IsOptional } from 'class-validator';
import { Body, Path, Query } from '../annotations/DTO';

export class DocumentRequestDTO {
  // Maps from path parameter 'documentid' to property 'documentId'
  @Path('document_id')
  @IsString({ message: 'Document ID must be a string' })
  documentId: string;

  // Maps from query parameter 'user_id' to property 'userId'
  @Query('user_id')
  @IsString({ message: 'User ID must be a string' })
  @IsOptional()
  userId?: string;

  // Maps from query parameter 'file_type' to property 'fileType'
  @Query('file_type')
  @IsString({ message: 'File type must be a string' })
  @IsOptional()
  fileType?: string;

  // Maps from body parameter 'content_data' to property 'contentData'
  @Body('content_data')
  @IsString({ message: 'Content data must be a string' })
  @IsOptional()
  contentData?: string;

  // Direct mapping (parameter name same as property name)
  @Query()
  @IsString({ message: 'Status must be a string' })
  @IsOptional()
  status?: string;
}
