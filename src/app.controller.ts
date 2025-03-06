import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: Request): string {
    console.log(request.session.id);
    if (request.session.views) {
      request.session.views += 1;
    } else {
      request.session.views = 1;
    }
    return this.appService.getHello() + '-' + request.session.views;
  }
}
