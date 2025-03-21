import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

/**
 * 레시피와 재료 간의 다대다 관계를 표현하는 중간 테이블
 */
@Entity()
export class RecipeIngredient {
  // 기본 키 설정
  @PrimaryColumn()
  recipeId: number;

  @PrimaryColumn()
  ingredientId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
    onDelete: 'CASCADE',
  })
  // recipeId 컬럼을 외래 키로 사용. "이 컬럼은 Recipe 테이블과 연결되어 있어"라고 "표시"
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, {
    eager: true,
    onDelete: 'CASCADE',
  })
  // ingredientId 컬럼을 외래 키로 사용
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;
}
