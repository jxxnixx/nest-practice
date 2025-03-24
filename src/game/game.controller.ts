import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoryDto, IngredientDto } from './dto/ingredient.dto';
import { RecipeDto } from './dto/recipe.dto';
import { AttemptDto, AttemptResultDto } from './dto/attempt.dto';
import {
  RecipeSearchGetResultDto,
  RecipeSearchPostResultDto,
  RecipeSearchDto,
} from './dto/recipe-search.dto';
import { ApiCommonResponse } from './common/decorators/api-response.decorator';
import { CommonResponseDto } from './dto/common-response.dto';

@ApiTags('게임')
@ApiExtraModels(
  IngredientDto,
  CategoryDto,
  RecipeDto,
  AttemptResultDto,
  CommonResponseDto,
)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * GET /game/ingredients
   * @returns 재료와 카테고리 목록
   */
  @Get('ingredients')
  @ApiOperation({
    summary: '재료 목록 조회',
    description: '카테고리별 재료 목록을 조회합니다.',
  })
  @ApiCommonResponse({
    type: CategoryDto,
    isArray: true,
    description: '카테고리별 재료 목록',
  })
  async getIngredients() {
    const data = await this.gameService.getIngredientsByCategory();
    return { data };
  }

  /**
   * GET /game/recipes
   * @returns 레시피 목록
   */
  @Get('recipes')
  @ApiOperation({
    summary: '레시피 목록 조회',
    description: '모든 레시피 목록을 조회합니다.',
  })
  @ApiCommonResponse({
    type: RecipeDto,
    isArray: true,
    description: '레시피 목록',
  })
  async getRecipes() {
    const data = await this.gameService.getRecipes();
    return { data };
  }

  /**
   * GET /game/completed
   * @returns 완료된 레시피 목록
   */
  @Get('completed')
  @ApiOperation({
    summary: '완료된 레시피 조회',
    description: '사용자가 완료한 레시피 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '완료된 레시피 목록',
    type: [RecipeDto],
  })
  async getCompletedRecipes() {
    return await this.gameService.getCompletedRecipes();
  }

  /**
   * POST /game/attempt
   * @param body 선택된 재료 목록
   * @returns 성공 여부와 결과
   */
  @Post('attempt')
  @ApiOperation({
    summary: '음료 제조 시도',
    description: '선택한 재료로 음료 제조를 시도합니다.',
  })
  @ApiBody({ type: AttemptDto })
  @ApiCommonResponse({
    type: AttemptResultDto,
    description: '음료 제조 결과',
  })
  async attempt(@Body() body: AttemptDto) {
    const data = await this.gameService.attemptMakeDrink(body.ingredients);
    return { data };
  }

  /**
   * GET /game/search-recipes
   * @param ingredients 검색할 재료 목록 (최대 3개)
   * @returns 레시피 검색 결과
   */
  @Get('search-recipes')
  @ApiOperation({
    summary: '재료로 레시피 검색 (GET)',
    description:
      '제공된 재료로 만들 수 있는 레시피를 검색합니다. 최대 3개까지의 재료를 쿼리 파라미터로 받습니다.',
  })
  @ApiQuery({
    name: 'ingredients',
    required: false,
    isArray: true,
    type: String,
    example: ['청포도'],
    description: '검색할 재료 목록 (최대 3개)',
  })
  @ApiResponse({
    status: 200,
    description: '레시피 검색 결과',
    type: RecipeSearchGetResultDto,
  })
  async searchRecipesGet(@Query('ingredients') ingredients: string | string[]) {
    // 문자열 또는 배열로 들어온 ingredients를 항상 배열로 처리
    let ingredientsArray: string[] = [];

    if (typeof ingredients === 'string') {
      // 단일 문자열일 경우 배열로 변환
      ingredientsArray = [ingredients];
    } else if (Array.isArray(ingredients)) {
      // 이미 배열인 경우 그대로 사용
      ingredientsArray = ingredients;
    }

    // 재료가 3개 이하인지 검증
    if (ingredientsArray.length > 3) {
      throw new BadRequestException(
        'GET 방식으로는 최대 3개까지의 재료만 검색할 수 있습니다. 더 많은 재료는 POST /game/search-recipes를 사용하세요.',
      );
    }

    return await this.gameService.searchRecipesByIngredients(ingredientsArray);
  }

  /**
   * POST /game/search-recipes
   * @param body 검색할 재료 목록
   * @returns 레시피 검색 결과
   */
  @Post('search-recipes')
  @ApiOperation({
    summary: '재료로 레시피 검색 (POST)',
    description:
      '제공된 재료로 만들 수 있는 레시피를 검색합니다. 개수 제한 없이 재료를 Body로 받습니다.',
  })
  @ApiBody({ type: RecipeSearchDto }) // 여기서는 type만 지정하고 example은 DTO에 정의
  @ApiResponse({
    status: 200,
    description: '레시피 검색 결과',
    type: RecipeSearchPostResultDto,
  })
  async searchRecipesPost(@Body() body: RecipeSearchDto) {
    return await this.gameService.searchRecipesByIngredients(body.ingredients);
  }
}
