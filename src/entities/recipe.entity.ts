import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';

/**
 * 레시피 테이블
 * 완성된 음료 레시피 정보를 저장
 */
@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  result: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.recipe,
    {
      cascade: true,
      eager: false,
    },
  )
  recipeIngredients: RecipeIngredient[];
}
