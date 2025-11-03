import 'reflect-metadata';

const META_PREFIX = 'ely:prefix';
const META_ROUTES = 'ely:routes';
const META_PARAMS = 'ely:params';

export function mountControllers(app: any, controllers: any[], container?: any) {
  for (const C of controllers) {
    const instance = container ? container.resolve(C) : new C();
    const prefix: string = Reflect.getMetadata(META_PREFIX, C) ?? '';
    const routes: any[] = Reflect.getMetadata(META_ROUTES, C) ?? [];
    const paramMeta: Record<string, { index: number; pick: (ctx: any) => any }[]> =
      Reflect.getMetadata(META_PARAMS, C) ?? {};
    for (const r of routes) {
      const fullPath = `${prefix}${r.path || ''}` || '/';
      const verb = r.verb.toLowerCase();
      const handler = (ctx: any) => {
        const picks = paramMeta[r.key as string] ?? [];
        if (picks.length) {
          const maxIndex = Math.max(...picks.map(x => x.index));
          const args = new Array(maxIndex + 1);
          for (const p of picks) args[p.index] = p.pick(ctx);
          return (instance as any)[r.key](...args);
        }
        return (instance as any)[r.key](ctx);
      };
      const register = app[verb] ?? app.all;
      register.call(app, fullPath, handler);
    }
  }
}
