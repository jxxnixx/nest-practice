import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { NumbersController } from './numbers/number.controller';
import { NumberService } from './numbers/number.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'cafe_game',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController, CatsController, NumbersController],
  providers: [AppService, NumberService],
})
export class AppModule {}
