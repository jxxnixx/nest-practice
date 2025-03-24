import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto<T> {
  @ApiProperty({
    description: '응답 데이터',
    type: 'object',
    additionalProperties: true,
  })
  data: T;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공적으로 처리되었습니다.',
    required: false,
  })
  message?: string;
}
