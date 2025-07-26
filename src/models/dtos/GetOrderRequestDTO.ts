import { IsString, IsOptional } from 'class-validator';
import { Path, Query } from '../annotations/DTO';

export class GetOrderRequestDTO {
  @Path()
  @IsString()
  id: string; // from path parameter 'id'

  @Query()
  @IsString()
  @IsOptional()
  salesource: string; // from query parameter 'salesource'

  @Query()
  @IsString()
  @IsOptional()
  saleschannel: string; // from query parameter 'saleschannel'
}