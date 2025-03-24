import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { CategoryDto, IngredientDto } from './dto/ingredient.dto';
import { RecipeDto } from './dto/recipe.dto';
import { AttemptDto, AttemptResultDto } from './dto/attempt.dto';

@ApiTags('게임')
@ApiExtraModels(IngredientDto, CategoryDto, RecipeDto, AttemptResultDto)
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
  @ApiResponse({
    status: 200,
    description: '카테고리별 재료 목록',
    type: [CategoryDto],
  })
  async getIngredients() {
    return await this.gameService.getIngredientsByCategory();
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
  @ApiResponse({
    status: 200,
    description: '레시피 목록',
    type: [RecipeDto],
  })
  async getRecipes() {
    return await this.gameService.getRecipes();
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
  @ApiResponse({
    status: 200,
    description: '음료 제조 결과',
    type: AttemptResultDto,
  })
  async attempt(@Body() body: AttemptDto) {
    return await this.gameService.attemptMakeDrink(body.ingredients);
  }
}
