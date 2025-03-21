import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * GET /game/ingredients
   * @returns 재료와 카테고리 목록
   */
  @Get('ingredients')
  async getIngredients() {
    return await this.gameService.getIngredientsByCategory();
  }

  /**
   * GET /game/recipes
   * @returns 레시피 목록
   */
  @Get('recipes')
  async getRecipes() {
    return await this.gameService.getRecipes();
  }

  /**
   * GET /game/completed
   * @returns 완료된 레시피 목록
   */
  @Get('completed')
  async getCompletedRecipes() {
    return await this.gameService.getCompletedRecipes();
  }

  /**
   * POST /game/attempt
   * @param body 선택된 재료 목록
   * @returns 성공 여부와 결과
   */
  @Post('attempt')
  async attempt(@Body() body: { ingredients: string[] }) {
    return await this.gameService.attemptMakeDrink(body.ingredients);
  }
}
