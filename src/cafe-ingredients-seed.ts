import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Ingredient } from './entities/ingredient.entity';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // 레포지토리 가져오기
    const categoryRepo = app.get(getRepositoryToken(Category));
    const ingredientRepo = app.get(getRepositoryToken(Ingredient));

    // 기존 데이터 확인
    const existingIngredients = await ingredientRepo.find();
    if (existingIngredients.length > 0) {
      console.log(
        '이미 재료 데이터가 존재합니다. 기존 데이터를 유지하시겠습니까? (y/n)',
      );
      const keepExisting = await new Promise((resolve) => {
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase() === 'y');
        });
      });

      if (keepExisting) {
        console.log('기존 재료를 유지합니다.');
        await app.close();
        return;
      } else {
        console.log('기존 재료를 삭제합니다...');
        await ingredientRepo.delete({});
        await categoryRepo.delete({});
      }
    }

    // JSON 파일 읽기 (카테고리와 재료)
    const ingredientsJsonPath = path.join(
      __dirname,
      '..',
      'json',
      'cafe_ingredients.json',
    );

    let ingredientsData;
    try {
      const fileContent = fs.readFileSync(ingredientsJsonPath, 'utf8');
      ingredientsData = JSON.parse(fileContent);
      console.log('재료 JSON 데이터 로드 완료');
    } catch (error) {
      console.error('재료 JSON 파일을 읽는 중 오류가 발생했습니다:', error);
      console.log(
        '파일 내용 확인:',
        fs.existsSync(ingredientsJsonPath) ? '파일 존재' : '파일 없음',
      );
      await app.close();
      return;
    }

    // 카테고리 및 재료 데이터 삽입
    console.log('카테고리 및 재료 데이터 삽입 중...');

    // 카테고리와 카테고리별 재료를 저장하기 위한 맵
    const categoryMap = new Map<string, Category>();
    const ingredientMap = new Map<string, Ingredient>();

    // 1. 먼저 모든 카테고리 생성
    for (const categoryData of ingredientsData.categories) {
      const category = categoryRepo.create({
        category: categoryData.category,
      });

      try {
        const savedCategory = await categoryRepo.save(category);
        categoryMap.set(savedCategory.category, savedCategory);
        console.log(`카테고리 생성: ${savedCategory.category}`);
      } catch (error) {
        console.error(
          `카테고리 ${category.category} 생성 중 오류:`,
          error.message,
        );
      }
    }

    // 2. 모든 카테고리별 재료 생성
    for (const categoryData of ingredientsData.categories) {
      const category = categoryMap.get(categoryData.category);

      if (!category) {
        console.error(`카테고리 ${categoryData.category}를 찾을 수 없습니다.`);
        continue;
      }

      for (const ingredientData of categoryData.ingredients) {
        try {
          const ingredient = ingredientRepo.create({
            nameKR: ingredientData.nameKR,
            nameEN: ingredientData.nameEN || '',
            imageURL: ingredientData.imageURL || '',
            category: category,
          });

          const savedIngredient = await ingredientRepo.save(ingredient);
          ingredientMap.set(savedIngredient.nameKR, savedIngredient);
          console.log(
            `재료 생성: ${savedIngredient.nameKR} (${savedIngredient.nameEN}) - 카테고리: ${category.category}`,
          );
        } catch (error) {
          console.error(
            `재료 ${ingredientData.nameKR} 생성 중 오류:`,
            error.message,
          );
        }
      }

      console.log(`카테고리 ${category.category}의 재료 생성 완료`);
    }

    // 3. cafe_ingredients 배열의 재료 중 아직 생성되지 않은 항목 추가
    if (
      ingredientsData.cafe_ingredients &&
      ingredientsData.cafe_ingredients.length > 0
    ) {
      console.log('추가 재료 검사 중...');
      let addedCount = 0;

      for (const ingredientData of ingredientsData.cafe_ingredients) {
        // 이미 등록된 재료인지 확인
        if (ingredientMap.has(ingredientData.nameKR)) {
          continue;
        }

        try {
          const ingredient = ingredientRepo.create({
            nameKR: ingredientData.nameKR,
            nameEN: ingredientData.nameEN || '',
            imageURL: ingredientData.imageURL || '',
            category: null,
          });

          const savedIngredient = await ingredientRepo.save(ingredient);
          ingredientMap.set(savedIngredient.nameKR, savedIngredient);
          addedCount++;
          console.log(
            `추가 재료 생성: ${savedIngredient.nameKR} (${savedIngredient.nameEN})`,
          );
        } catch (error) {
          console.error(
            `재료 ${ingredientData.nameKR} 생성 중 오류:`,
            error.message,
          );
        }
      }

      console.log(`카테고리 없는 추가 재료 ${addedCount}개 생성 완료`);
    }

    console.log(`총 ${ingredientMap.size}개의 재료가 생성되었습니다.`);
    console.log('카페 재료 시딩이 완료되었습니다!');
  } catch (error) {
    console.error('데이터 시딩 중 오류가 발생했습니다:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
