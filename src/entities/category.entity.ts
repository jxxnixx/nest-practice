import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from './ingredient.entity';
/**
 * 재료 분류 테이블
 */
@Entity()
export class Category {
  @PrimaryGeneratedColumn() // 기본 키, DB가 값 자동 생성
  id: number;

  @Column({ unique: true }) // 중복 불허
  name: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.category, {
    cascade: true,
  })
  // one Category to many Ingredient
  // 한 Category는 여러 Ingredient를 가질 수 있음
  // cascade : 부모 엔티티가 삭제될 때 자식 엔티티도 함께 삭제되도록 설정
  ingredients: Ingredient[];
}
