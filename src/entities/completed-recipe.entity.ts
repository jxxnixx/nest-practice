import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class CompletedRecipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, { eager: true })
  recipe: Recipe;

  @CreateDateColumn() // 레코드 생성 시각 자동 기록
  completedAt: Date;
}
