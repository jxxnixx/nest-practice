import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiErrorResponse(status: number, description: string) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        properties: {
          statusCode: { type: 'number', example: status },
          message: { type: 'string', example: description },
          error: {
            type: 'string',
            example: description.split(' ').join('_').toUpperCase(),
          },
        },
      },
    }),
  );
}
