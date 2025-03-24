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

  async getRecipes(): Promise<Recipe[]> {
    // recipeIngredients를 eager loading으로 불러오기
    return await this.recipeRepository.find({
      relations: {
        recipeIngredients: {
          ingredient: true,
        },
      },
    });
  }

  async attemptMakeDrink(selectedIngredients: string[]): Promise<any> {
    // 전체 레시피를 가져올 때 관계된 데이터까지 모두 로드
    const recipes = await this.recipeRepository.find({
      relations: {
        recipeIngredients: {
          ingredient: true,
        },
      },
    });

    const sortedSelected = [...selectedIngredients].sort();
    console.log('Selected ingredients:', sortedSelected);

    let matchedRecipe = null;

    for (const recipe of recipes) {
      if (!recipe.recipeIngredients || recipe.recipeIngredients.length === 0) {
        console.log(`Recipe "${recipe.result}": No ingredients found`);
        continue;
      }

      const recipeIngredientNames = recipe.recipeIngredients
        .filter((ri) => ri && ri.ingredient)
        .map((ri) => ri.ingredient.nameKR)
        .sort();

      console.log(`Checking recipe "${recipe.result}":`, recipeIngredientNames);

      // 재료 이름 배열을 비교
      const isMatch =
        JSON.stringify(recipeIngredientNames) ===
        JSON.stringify(sortedSelected);

      if (isMatch) {
        matchedRecipe = recipe;
        break;
      }
    }

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

  async searchRecipesByIngredients(
    ingredients: string[],
  ): Promise<{ recipes: any[] }> {
    // 전체 레시피를 가져올 때 관계된 데이터까지 모두 로드
    const recipes = await this.recipeRepository.find({
      relations: {
        recipeIngredients: {
          ingredient: true,
        },
      },
    });

    // 단일 재료인 경우: 해당 재료가 포함된 모든 레시피 반환
    if (ingredients.length === 1) {
      const singleIngredient = ingredients[0];
      const matchingRecipes = recipes.filter((recipe) => {
        const recipeIngredientNames = recipe.recipeIngredients
          .filter((ri) => ri && ri.ingredient)
          .map((ri) => ri.ingredient.nameKR);

        return recipeIngredientNames.includes(singleIngredient);
      });

      return {
        recipes: matchingRecipes.map((recipe) => ({
          result: recipe.result,
          description: recipe.description,
          ingredients: recipe.recipeIngredients.map(
            (ri) => ri.ingredient.nameKR,
          ),
        })),
      };
    }

    // 여러 재료인 경우: 정확히 그 재료들로 만들 수 있는 레시피 반환
    const sortedInputIngredients = [...ingredients].sort();

    const matchingRecipes = recipes.filter((recipe) => {
      if (!recipe.recipeIngredients || recipe.recipeIngredients.length === 0) {
        return false;
      }

      const recipeIngredientNames = recipe.recipeIngredients
        .filter((ri) => ri && ri.ingredient)
        .map((ri) => ri.ingredient.nameKR)
        .sort();

      // 재료 목록이 정확히 일치하는지 확인
      return (
        JSON.stringify(recipeIngredientNames) ===
        JSON.stringify(sortedInputIngredients)
      );
    });

    return {
      recipes: matchingRecipes.map((recipe) => ({
        result: recipe.result,
        description: recipe.description,
        ingredients: recipe.recipeIngredients.map((ri) => ri.ingredient.nameKR),
      })),
    };
  }
}
