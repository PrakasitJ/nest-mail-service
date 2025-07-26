import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const DTO = createParamDecorator(
  async (dtoClass: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Create instance of DTO
    const dtoInstance = new dtoClass();
    
    // Get metadata for each source type
    const pathParams = Reflect.getMetadata(PATH_METADATA, dtoInstance) || [];
    const queryParams = Reflect.getMetadata(QUERY_METADATA, dtoInstance) || [];
    const bodyParams = Reflect.getMetadata(BODY_METADATA, dtoInstance) || [];
    
    const data: any = {};
    
    // Map path parameters
    pathParams.forEach(({ propertyKey, paramName }) => {
      data[propertyKey] = request.params[paramName];
    });
    
    // Map query parameters
    queryParams.forEach(({ propertyKey, paramName }) => {
      data[propertyKey] = request.query[paramName];
    });
    
    // Map body parameters
    bodyParams.forEach(({ propertyKey, paramName }) => {
      data[propertyKey] = request.body[paramName];
    });
    
    // Transform and validate
    const dto = plainToClass(dtoClass, data);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors.map(e => Object.values(e.constraints || {})).join(', ')}`);
    }
    
    return dto;
  },
);

import 'reflect-metadata';

export const PATH_METADATA = 'path_params';
export const QUERY_METADATA = 'query_params';
export const BODY_METADATA = 'body_params';

export function Path(paramName?: string) {
  return function (target: any, propertyKey: string) {
    const existingParams = Reflect.getMetadata(PATH_METADATA, target) || [];
    existingParams.push({ propertyKey, paramName: paramName || propertyKey });
    Reflect.defineMetadata(PATH_METADATA, existingParams, target);
  };
}

export function Query(paramName?: string) {
  return function (target: any, propertyKey: string) {
    const existingParams = Reflect.getMetadata(QUERY_METADATA, target) || [];
    existingParams.push({ propertyKey, paramName: paramName || propertyKey });
    Reflect.defineMetadata(QUERY_METADATA, existingParams, target);
  };
}

export function Body(paramName?: string) {
  return function (target: any, propertyKey: string) {
    const existingParams = Reflect.getMetadata(BODY_METADATA, target) || [];
    existingParams.push({ propertyKey, paramName: paramName || propertyKey });
    Reflect.defineMetadata(BODY_METADATA, existingParams, target);
  };
}