import { ApiProperty } from '@nestjs/swagger';

export class IngredientDto {
  @ApiProperty({
    description: '재료 한글 이름',
    example: '우유',
  })
  nameKR: string;

  @ApiProperty({
    description: '재료 영어 이름',
    example: 'milk',
  })
  nameEN: string;

  @ApiProperty({
    description: '재료 이미지 URL',
    example: 'https://example.com/milk.jpg',
  })
  image: string;
}

export class CategoryDto {
  @ApiProperty({
    description: '재료 카테고리 이름',
    example: '우유/크림',
  })
  name: string;

  @ApiProperty({
    description: '카테고리에 속한 재료 목록',
    type: [IngredientDto],
  })
  ingredients: IngredientDto[];
}
