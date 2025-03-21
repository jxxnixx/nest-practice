import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

/**
 * 사용자가 완성한 레시피 기록 테이블
 */
@Entity()
export class CompletedRecipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @CreateDateColumn() // 레코드 생성 시각 자동 기록
  completedAt: Date;
}
