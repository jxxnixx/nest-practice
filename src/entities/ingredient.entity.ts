import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

/**
 * 재료 테이블
 * cafe_ingredients.json의 ingredients 배열 항목 및 cafe_ingredients 항목에 매핑
 */
@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nameKR: string;

  @Column({ unique: true, nullable: false, default: '' })
  nameEN: string;

  @Column({ nullable: false, default: '' })
  imageURL: string;

  @ManyToOne(() => Category, (category) => category.ingredients, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;
}
