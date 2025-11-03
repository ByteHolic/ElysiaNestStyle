import { Module } from '@core/di';
import { UsersService, UserRepo } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [
    UserRepo,
    UsersService
  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
