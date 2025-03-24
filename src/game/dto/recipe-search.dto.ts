import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { RecipeDto } from './recipe.dto';

export class RecipeSearchDto {
  @ApiProperty({
    description: '검색할 재료 목록',
    example: ['오레오', '카라멜 시럽', '우유', '얼음'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];
}

export class RecipeSearchGetResultDto {
  @ApiProperty({
    description: '검색 결과 레시피 목록 (GET)',
    example: [
      {
        result: '청포도에이드',
        description:
          '청포도의 상큼한 맛과 탄산수의 청량함이 어우러진 그린 에이드.',
        ingredients: ['청포도', '탄산수'],
      },
      {
        result: '청포도민트에이드',
        description:
          '청포도의 상큼함과 민트의 청량감이 탄산수와 어우러진 리프레싱 에이드.',
        ingredients: ['청포도', '민트', '탄산수'],
      },
      {
        result: '청포도요거트스무디',
        description:
          '청포도의 상큼함과 요거트의 크리미함이 얼음과 어우러진 시원한 스무디.',
        ingredients: ['청포도', '요거트', '얼음'],
      },
      {
        result: '청포도유자에이드',
        description:
          '청포도와 유자의 상큼함이 탄산수와 어우러진 상쾌한 에이드.',
        ingredients: ['청포도', '유자', '탄산수'],
      },
      {
        result: '청포도라임에이드',
        description: '청포도와 라임의 상큼함이 탄산수와 어우러진 그린 에이드.',
        ingredients: ['청포도', '라임', '탄산수'],
      },
      {
        result: '청포도키위에이드',
        description: '청포도와 키위의 상큼함이 탄산수와 어우러진 그린 에이드.',
        ingredients: ['청포도', '키위', '탄산수'],
      },
      {
        result: '청포도레몬에이드',
        description:
          '청포도와 레몬의 상큼함이 탄산수와 어우러진 시트러스 에이드.',
        ingredients: ['청포도', '레몬', '탄산수'],
      },
    ],
    type: [RecipeDto],
  })
  recipes: RecipeDto[];
}

export class RecipeSearchPostResultDto {
  @ApiProperty({
    description: '검색 결과 레시피 목록 (POST)',
    example: [
      {
        result: '카라멜오레오쉐이크',
        description:
          '오레오의 바삭함과 카라멜의 달콤함이 우유, 얼음과 어우러진 쉐이크.',
        ingredients: ['오레오', '카라멜 시럽', '우유', '얼음'],
      },
    ],
    type: [RecipeDto],
  })
  recipes: RecipeDto[];
}
