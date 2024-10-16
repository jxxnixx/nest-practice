import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// #### Controller

// - responsible for handling incoming requests & returning responses to the client
// - purpose : receive specific requests for the application

// - routing mecanism : controls 'which controller' receives 'which requests'
// (frequently, each controller has more than one route & different routes can perform different actions)

// - classes & decorators : we use them to create a basic controller
// - decorators : associate classes with required metatdata & enable Nest to create a routing map

// - CLI's CRUD generator : use it when you want to create a CRUD controller with the validation built-in quickly

// -------------------------------------------

// #### Routing

// @Controller()
// - controller decorator
// - required to define a basic controller

// - using a path prefix in a @Controller()
// : allows us to easily group a set of related routes & minimized repetitive code

// - $nest g controller [name]
// : execute to create a controller using the CLI
// ex) nest g controller cats -> create a cats folder & controller file
