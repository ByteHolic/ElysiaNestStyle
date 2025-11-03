import { Injectable } from '@core/di';

export class UserRepo {
  findAll() { return ['a', 'b']; }
}

@Injectable()
export class UsersService {
  constructor(private repo: UserRepo) {}
  all() { return this.repo.findAll(); }
}
