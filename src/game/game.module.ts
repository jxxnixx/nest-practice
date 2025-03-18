import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { CompletedRecipe } from 'src/entities/completed-recipe.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { RecipeIngredient } from 'src/entities/recipe-ingredient.entity';
import { Recipe } from 'src/entities/recipe.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Ingredient,
      Recipe,
      RecipeIngredient,
      CompletedRecipe,
    ]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
