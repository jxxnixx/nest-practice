import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export interface ApiResponseOptions {
  type: Type<any>;
  isArray?: boolean;
  description?: string;
}

export function ApiCommonResponse(options: ApiResponseOptions) {
  const { type, isArray = false, description } = options;

  return applyDecorators(
    ApiExtraModels(type),
    ApiOkResponse({
      description: description || '성공적인 응답',
      schema: {
        allOf: [
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(type) },
                  }
                : { $ref: getSchemaPath(type) },
            },
          },
        ],
      },
    }),
  );
}
