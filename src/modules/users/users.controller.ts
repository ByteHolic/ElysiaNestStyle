import { Controller, Get, Param, Body, Query, Post } from '@core/http';
import { Inject } from '@core/di';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(@Inject(UsersService) public usersService: UsersService) {}

  @Get('/:id')
  getUser(@Param() params: any, @Query() query: any) {
    return { user: this.usersService.all()[params.id], query };
  }

  @Post('/')
  createUser(@Body() body: any) {
    return { created: body };
  }
}
