import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users/users.service.js';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/health')
  health() {
    return { status: 'ok' };
  }

  @Get('/stats/users')
  async getUserStats() {
    return this.usersService.getUserStats();
  }
}

