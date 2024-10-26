import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NumberService } from './number.service';
import { ReplaceNumberDto } from './numbers.dto';

@Controller('numbers')
export class NumbersController {
  constructor(private readonly numberService: NumberService) {}

  @Get()
  getList() {
    return this.numberService.getList();
  }

  @Get(':index')
  getNumber(@Param('index') index: number) {
    return this.numberService.getNumber(index);
  }

  @Delete()
  getAndDeleteLastNumber() {
    return this.numberService.getAndDeleteLastNumber();
  }

  @Post('/add/:number')
  addNumber(@Param('number') number: number) {
    return this.numberService.addNumber(number);
  }

  @Patch('/replace')
  replaceNumber(@Body() replaceNumberDto: ReplaceNumberDto) {
    console.log('test');

    console.log(replaceNumberDto);

    return this.numberService.replaceNumber(
      replaceNumberDto.index,
      replaceNumberDto.number,
    );
  }

  @Delete('/delete/number/:index')
  deleteNumber(@Param('index') index: number) {
    return this.numberService.deleteNumber(index);
  }

  @Delete('/delete/list')
  deleteList() {
    return this.numberService.deleteList();
  }
}
