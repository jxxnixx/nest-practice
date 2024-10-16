import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}

// #### HTTP request method decorator (@Get())
// - get HTTP request method decorator
// - tells Nest to create a handler for a specific endpoint for HTTP requests

// the endpoint : corresponds to the HTTP request method (GET, POST, ...) & the route path
// the route path
// : determined by concatenating
//   the (optional) prefix declared for the controller + any path specified in the method's decorator
// : incldes both the optional controller path prefix & any path string declared in the request method decorator
//   ex) GET /cats/breed -> a path prefix or 'cats' combined with the decorator @Get('breed')

// #### user-defined method (findAll())
// - completely arbitrary (100% 임의)
// - we obviously must declare a method to bind the route to, but Nest doesn't attach any significance to the method name chosen. (no meaning for the method name)

// two different options for manipulating the response

// 1. Standard(recommended)
// - built-in method
// - makes response handling simple : just return the value & Nest takes care of the rest
//   -> AUTOMATICALLY serializes the return value to JSON when it is a JS object or array
//   -> send just the return value without attempting to serialize when it is just JS primitive type(string, number, boolean, ...)
// - status code
// : 200 by default, expect for POST requests which use 201
// : @HttpCode(...) decorator -> we can easily change the status code

// 2. Library-specific
// - @Res decorator : can inject the library-specific response object
//   ex) findAll(@Res() response)
// - with this approach, you have the ability to use the native response handling methods exposed by the object
//   ex) response.status(200).send()

// WARNING
// - you must set the 'passthrough' option to 'true' in the '@Res({passthrough : true})' decorator to use both approaches(@Res() or @Next()) at the same time
// - because
// : Nest detects when the handler is using either @Res() or @Next(), indicating you have chosen the library-specific option
// : the Standard approach is AUTOMATICALLY DISABLED for this single route and will no longer work as expected if both approaches are used at the same time

// -------------------------------------------

// #### Request object (@Req())
// - nest provides @Req decorator to access the request object
// - nest provides access to the request object of the underlying platform(기본 플랫폼. express by default)

// - install @types/express package to take advantage of express typings
// - ex) @Req() request: Request

// - represents the HTTP request
// - has properties for the equest query string, parameters, HTTP headers, and body
// - it's unnecessary to grab these properties manually
// - we can use dedicated decoreators instead, such as @Body() or @Query()

// provided decorators & the plain platform-specific objects they respresent
// 1. req -> @Request(), @Req()
// 2. res -> @Response(), @Res() *
// 3. next -> @Next()
// 4. req.session -> @Session()
// 5. req.params / req.params[key] -> @Param(key?: string)
// 6. req.body / req.body[key] -> @Body(key?: string)
// 7. req.query / req.query[key] -> @Query(key?: string)
// 8. req.headers / req.headers[name] -> @Headers(name?: string)
// 9. req.ip -> @Ip()
// 10. req.hosts -> @HostParam()

// - @Res() : simply an alias for @Response()
// - you should import the typings for the underlying library( @types/express ) to take full advantage
// - you pust Nest into LIBRARY-SPECIFIC mode when you inject @Res() or @Response() + you become responsible for managing the response
// - you must issue some kind of reponse by making a call on the reponse object when using those handlers, or the HTTP server will hang

// -------------------------------------------

// #### Resources
// - Nest provides decorators for all or the standard HTTP methods
// : @Get(), @Post(), @Put(), @Delete(), @Patch(), @Options(), @Head()
// : @All() : for all HTTP methods

// -------------------------------------------

// #### Route wildcards
// - pattern based routes are supported
// - the asterisk ( * ) is used as a wildcard & will match any combination of characters
// - ex) @Get('ab*cd') : will match 'abcd', 'ab_cd', 'abecd', ...

// - ?, +, *, () : may be used in a route path & are subsets of their regular expression couterparts (route path에 사용, 정규식 대응 하위 집합)
// - -, . : are interpreted literally by string-based paths (string-based path 문자열 기반 경로에 사용, 문자 그대로 해석)

// WARNING
// - a wildcard in the middle of the route is only supported by express
