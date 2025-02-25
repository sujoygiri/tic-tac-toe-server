import { Controller, Get, Ip, Query, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  @Get()
  greetUser(@Ip() ip: string, @Query('name') name: string): string {
    console.log(ip);
    return 'Hello user';
  }
}
