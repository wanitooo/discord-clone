import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/create-user')
  createUser() {
    return this.appService.createUser();
  }

  @Get('/migrate')
  migrateDb() {
    return this.appService.migrate();
  }
}
