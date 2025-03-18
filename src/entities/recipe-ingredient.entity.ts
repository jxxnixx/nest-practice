import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

@Entity()
export class RecipeIngredient {
  @PrimaryColumn()
  recipeId: number;

  @PrimaryColumn()
  ingredientId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
    onDelete: 'CASCADE',
  })
  // onDelete: 'CASCADE' => Recipe가 삭제될 때 RecipeIngredient도 함께 삭제됨
  recipe: Recipe;

  @ManyToOne(() => Ingredient, { eager: true })
  // eager: true => RecipeIngredient을 조회할 때, 연결된 Ingredient도 함께 조회
  ingredient: Ingredient;
}
