import { All, Controller, Get } from '@core/http';
import { AuthService } from './auth.service';
import { Inject } from '@core/di';

@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private auth: AuthService) {}

  @Get('/login')
  login() { return this.auth.login(); }

  @All('/')
  all() {return "All Methods"}
}
