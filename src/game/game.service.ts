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

  async getAllIngredients(): Promise<any[]> {
    const ingredients = await this.ingredientRepository.find();

    return ingredients.map((ingredient) => ({
      nameKR: ingredient.nameKR,
      nameEN: ingredient.nameEN,
      image: ingredient.imageURL,
    }));
  }

  async getIngredientsByCategory(): Promise<any[]> {
    const ingredients = await this.ingredientRepository.find({
      relations: ['category'],
    });
    const categoriesMap = new Map<string, any[]>();

    ingredients.forEach((ingredient) => {
      const categoryName = ingredient.category
        ? ingredient.category.category
        : '기타';

      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, []);
      }

      categoriesMap.get(categoryName).push({
        nameKR: ingredient.nameKR,
        nameEN: ingredient.nameEN,
        image: ingredient.imageURL,
      });
    });

    return Array.from(categoriesMap, ([name, ingredients]) => ({
      name,
      ingredients,
    }));
  }

  async getRecipes(): Promise<any[]> {
    const recipes = await this.recipeRepository.find({
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
    });

    return recipes.map((recipe) => ({
      id: recipe.id,
      result: recipe.result,
      description: recipe.description,
      recipeIngredients: recipe.recipeIngredients.map(
        (ri) => ri.ingredient.nameKR,
      ),
    }));
  }

  async attemptMakeDrink(selectedIngredients: string[]): Promise<any> {
    const recipes = await this.getRecipes();
    const sortedSelected = [...selectedIngredients].sort();

    const matchedRecipe = recipes.find((recipe) => {
      const recipeIngredientNames = recipe.recipeIngredients
        .map((ri) => ri.ingredient.nameKR)
        .sort();

      return (
        JSON.stringify(recipeIngredientNames) === JSON.stringify(sortedSelected)
      );
    });

    if (matchedRecipe) {
      const completed = this.completedRecipeRepository.create({
        recipe: matchedRecipe,
      });

      await this.completedRecipeRepository.save(completed);

      return {
        success: true,
        recipe: {
          result: matchedRecipe.result,
          description: matchedRecipe.description,
          message: matchedRecipe.description,
        },
      };
    } else {
      return {
        success: false,
        recipe: null,
        message: '선택한 재료로 만들 수 있는 메뉴가 없습니다.',
      };
    }
  }

  async getCompletedRecipes(): Promise<CompletedRecipe[]> {
    return await this.completedRecipeRepository.find();
  }
}
