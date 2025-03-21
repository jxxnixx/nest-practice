import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // 레포지토리 가져오기
    const ingredientRepo = app.get(getRepositoryToken(Ingredient));
    const recipeRepo = app.get(getRepositoryToken(Recipe));
    const recipeIngredientRepo = app.get(getRepositoryToken(RecipeIngredient));

    // 기존 레시피 확인
    const existingRecipes = await recipeRepo.find();
    if (existingRecipes.length > 0) {
      console.log(
        '이미 레시피가 존재합니다. 기존 데이터를 유지하시겠습니까? (y/n)',
      );
      const keepExisting = await new Promise((resolve) => {
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase() === 'y');
        });
      });

      if (keepExisting) {
        console.log('기존 레시피를 유지합니다.');
        await app.close();
        return;
      } else {
        console.log('기존 레시피를 삭제합니다...');
        // 외래 키 제약 조건으로 인해 먼저 recipe_ingredient를 삭제해야 함
        await recipeIngredientRepo.delete({});
        await recipeRepo.delete({});
        console.log('기존 레시피 및 레시피-재료 관계가 모두 삭제되었습니다.');
      }
    }

    // JSON 파일 읽기 (레시피)
    const recipesJsonPath = path.join(__dirname, '..', 'json', 'cafe.json');
    let recipesData;

    try {
      const fileContent = fs.readFileSync(recipesJsonPath, 'utf8');
      recipesData = JSON.parse(fileContent);
      console.log('레시피 JSON 데이터 로드 완료');
    } catch (error) {
      console.error('레시피 JSON 파일을 읽는 중 오류가 발생했습니다:', error);
      console.log(
        '파일 내용 확인:',
        fs.existsSync(recipesJsonPath) ? '파일 존재' : '파일 없음',
      );
      await app.close();
      return;
    }

    // cafe.json의 형식에 따라 파싱 방법 조정
    const recipes = Array.isArray(recipesData)
      ? recipesData
      : recipesData.recipes || recipesData.cafe || [];

    if (recipes.length === 0) {
      console.error('레시피 데이터가 없습니다. JSON 형식을 확인하세요.');
      await app.close();
      return;
    }

    console.log(`총 ${recipes.length}개의 레시피를 찾았습니다.`);

    // 모든 재료 가져오기
    const allIngredients = await ingredientRepo.find();

    if (allIngredients.length === 0) {
      console.error(
        '데이터베이스에 재료가 없습니다. 먼저 재료 시드를 실행하세요.',
      );
      await app.close();
      return;
    }

    // 재료 이름으로 맵 생성
    const ingredientMap = new Map<string, Ingredient>(
      allIngredients.map((ing) => [ing.nameKR, ing]),
    );

    console.log(
      `${allIngredients.length}개의 재료를 데이터베이스에서 로드했습니다.`,
    );

    // 레시피 삽입
    console.log('레시피 삽입 중...');

    let successCount = 0;
    let errorCount = 0;

    for (const recipeData of recipes) {
      try {
        // 일부 레시피는 result와 description이 없을 수 있음
        if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
          console.log(`경고: 재료가 없는 레시피를 건너뜁니다.`);
          continue;
        }

        const result = recipeData.result || '이름 없는 음료';
        const description = recipeData.description || '설명이 없습니다.';

        // 레시피 생성
        const recipe = recipeRepo.create({
          result,
          description,
        });

        const savedRecipe = await recipeRepo.save(recipe);

        // 레시피-재료 관계 생성
        const recipeIngredients = [];

        for (const ingredientName of recipeData.ingredients) {
          let ingredient = ingredientMap.get(ingredientName);

          if (!ingredient) {
            // 재료가 없으면 새로 생성
            const newIngredient = ingredientRepo.create({
              nameKR: ingredientName,
              nameEN: '',
              imageURL: '',
              category: null,
            });

            try {
              ingredient = await ingredientRepo.save(newIngredient);
              console.log(`새 재료 생성: "${ingredientName}"`);

              // ingredientMap에 추가하여 다음 레시피에서 재사용
              ingredientMap.set(ingredientName, ingredient);
            } catch (error) {
              console.error(
                `새 재료 "${ingredientName}" 생성 중 오류: ${error.message}`,
              );
              // 실패했지만 계속 진행
            }
          }

          if (ingredient) {
            recipeIngredients.push({
              recipeId: savedRecipe.id,
              ingredientId: ingredient.id,
              recipe: savedRecipe,
              ingredient,
            });
          } else {
            console.error(
              `레시피 "${result}"의 재료 "${ingredientName}"를 생성할 수 없습니다.`,
            );
          }
        }

        if (recipeIngredients.length > 0) {
          await recipeIngredientRepo.save(recipeIngredients);
          console.log(
            `레시피 생성: ${savedRecipe.result} (재료 ${recipeIngredients.length}개)`,
          );

          successCount++;
        } else {
          console.log(
            `경고: "${savedRecipe.result}" 레시피에 유효한 재료가 없어서 레시피-재료 관계를 생성하지 않습니다.`,
          );
          // 유효한 재료가 없는 경우 레시피 삭제
          await recipeRepo.delete(savedRecipe.id);
          errorCount++;
        }
      } catch (error) {
        console.error(
          `레시피 "${recipeData.result || '이름 없음'}" 생성 중 오류: ${error.message}`,
        );
        if (error.stack) {
          console.error(`스택 정보: ${error.stack}`);
        }
        errorCount++;
      }
    }

    console.log(
      `레시피 생성 완료 - 성공: ${successCount}, 실패: ${errorCount}`,
    );

    console.log('카페 레시피 시딩이 완료되었습니다!');
  } catch (error) {
    console.error('데이터 시딩 중 오류가 발생했습니다:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
