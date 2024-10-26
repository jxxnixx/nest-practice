import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Worlds!!';
  }

  cuteCute(abc: string): string {
    return `cute is cuter than ${abc}`;
  }
}
