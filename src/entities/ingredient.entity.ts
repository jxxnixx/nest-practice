import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category, (category) => category.ingredients, {
    nullable: true,
  })
  // many Ingredient to one Category
  // 여러 Ingredient가 하나의 Category에 속할 수 있음
  category: Category;
}
