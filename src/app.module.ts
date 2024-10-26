import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { NumbersController } from './numbers/number.controller';
import { NumberService } from './numbers/number.service';

@Module({
  imports: [],
  controllers: [AppController, CatsController, NumbersController],
  providers: [AppService, NumberService],
})
export class AppModule {}
