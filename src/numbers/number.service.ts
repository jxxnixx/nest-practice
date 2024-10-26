import { Injectable } from '@nestjs/common';

@Injectable()
export class NumberService {
  numberList: number[] = [1, 2, 3, 4, 5];

  getList() {
    return this.numberList;
  }

  getNumber(index: number) {
    return this.numberList[index];
  }

  getAndDeleteLastNumber() {
    return this.numberList.pop();
  }

  addNumber(number: number) {
    this.numberList.push(number);

    return this.numberList;
  }

  replaceNumber(index: number, number: number) {
    this.numberList[index] = number;

    return this.numberList;
  }

  deleteNumber(index: number) {
    this.numberList.splice(index, 1);

    return this.numberList;
  }

  deleteList() {
    this.numberList = [];

    return this.numberList;
  }
}
