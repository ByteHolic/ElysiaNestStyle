import { Injectable, Inject } from '@core/di';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(@Inject(UsersService) private users: UsersService) {}
  login() { return { ok: true, userCount: this.users.all().length }; }
}
