import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { Recipe } from 'src/entities/recipe.entity';
import { CompletedRecipe } from 'src/entities/completed-recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,

    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,

    @InjectRepository(CompletedRecipe)
    private completedRecipeRepository: Repository<CompletedRecipe>,
  ) {}
}
