# 🚀 ElysiaJS Modular Starter

NestJS-inspired, blazing-fast TypeScript starter for Bun—built on ElysiaJS.  
Features include:

- DI with decorators (`@Injectable`, `@Inject`, `@Module`)
- MVC-style modular controllers, modules, services
- Route parameter decorators (`@Param`, `@Body`, `@Query`)
- Plug-and-play folder structure for scalable Bun APIs
- Auto-mounting/all controller routes from modules
- Clean imports via TypeScript path aliases (`@core`, etc.)

---

## Quick Start

```
bun install
bun run dev
```
Visit: [http://localhost:3000](http://localhost:3000)

---

## Example Controller

```
import { Controller, Get, Param, Body, Query } from '@core/http';
import { Inject } from '@core/di';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(@Inject(UsersService) public svc: UsersService) {}

  @Get('/:id')
  getUser(@Param() params: any, @Query() query: any) {
    return { userId: params.id, query };
  }

  @Post('/')
  createUser(@Body() body: any) {
    return { created: body };
  }
}
```

---

## Example Service

```
import { Injectable } from '@core/di';

@Injectable()
export class UsersService {
  all() { return ['a', 'b', 'c']; }
}
```

---

## Main Application Entry

```
import 'reflect-metadata';
import { Elysia } from 'elysia';
import { AppModule } from './app.module';
import { mountModule } from '@core/di';

const app = new Elysia();
mountModule(app, AppModule);
app.listen(3000);
console.log('Server started on http://localhost:3000');
```

---

## Project Structure

```
src/
  core/
    di/
    http/
  modules/
    users/
  app/
```

---

## Why Use This Starter?

- TypeScript-first development with Bun and ElysiaJS
- Familiar DI and modular patterns for rapid team onboarding
- Extensible for real projects: just add more folders!

---

## Requirements

- Bun ≥ 1.0
- ElysiaJS
- `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in tsconfig.json
- `reflect-metadata` installed and imported
