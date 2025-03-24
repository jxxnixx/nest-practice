import { ApiProperty } from '@nestjs/swagger';

export class RecipeDto {
  @ApiProperty({
    description: '완성된 음료 이름',
    example: '카라멜 마끼아또',
  })
  result: string;

  @ApiProperty({
    description: '음료 설명',
    example: '달콤한 카라멜과 에스프레소의 조화로운 맛',
  })
  description: string;
}
