import { Elysia } from 'elysia';
import { AppModule } from './app.module';
import { mountModule } from '@core/di';

const app = new Elysia();

mountModule(app, AppModule);

app.listen(process.env.PORT || 3000);
console.log(`Server started on http://localhost:${process.env.PORT || 3000}`);
