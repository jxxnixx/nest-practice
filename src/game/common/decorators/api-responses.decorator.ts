import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiCommonResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: '잘못된 요청 파라미터',
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
    ApiResponse({
      status: 403,
      description: '권한 없음',
    }),
    ApiResponse({
      status: 500,
      description: '서버 오류',
    }),
  );
};

export interface PaginationResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              total: {
                type: 'number',
                description: '전체 항목 수',
              },
              page: {
                type: 'number',
                description: '현재 페이지',
              },
              limit: {
                type: 'number',
                description: '페이지당 항목 수',
              },
            },
          },
        ],
      },
    }),
  );
};
