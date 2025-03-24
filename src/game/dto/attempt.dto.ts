import { ApiProperty } from '@nestjs/swagger';

export class AttemptDto {
  @ApiProperty({
    description: '선택한 재료 목록',
    example: ['우유', '에스프레소', '카라멜 시럽'],
    type: [String],
  })
  ingredients: string[];
}

export class AttemptResultDto {
  @ApiProperty({
    description: '음료 제조 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '완성된 레시피 정보',
    type: 'object',
    nullable: true,
    properties: {
      result: {
        type: 'string',
        example: '카라멜 마끼아또',
      },
      description: {
        type: 'string',
        example: '달콤한 카라멜과 에스프레소의 조화로운 맛',
      },
      message: {
        type: 'string',
        example: '달콤한 카라멜과 에스프레소의 조화로운 맛',
      },
    },
  })
  recipe: any;

  @ApiProperty({
    description: '결과 메시지',
    example: '음료 제조에 성공했습니다!',
    nullable: true,
  })
  message?: string;
}
