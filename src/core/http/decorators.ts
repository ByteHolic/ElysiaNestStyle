import 'reflect-metadata';

const META_PREFIX = 'ely:prefix';
const META_ROUTES = 'ely:routes';
const META_PARAMS = 'ely:params';

type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'ALL';

export const Controller = (prefix = ''): ClassDecorator =>
  target => Reflect.defineMetadata(META_PREFIX, prefix, target);

const defineRoute = (verb: HttpVerb) => (path = ''): MethodDecorator =>
  (target, key, descriptor) => {
    const Ctor = target.constructor;
    const routes: any[] = Reflect.getMetadata(META_ROUTES, Ctor) ?? [];
    routes.push({ verb, path, key });
    Reflect.defineMetadata(META_ROUTES, routes, Ctor);
    return descriptor;
  };

export const Get = defineRoute('GET');
export const Post = defineRoute('POST');
export const Put = defineRoute('PUT');
export const Patch = defineRoute('PATCH');
export const Delete = defineRoute('DELETE');
export const Options = defineRoute('OPTIONS');
export const Head = defineRoute('HEAD');
export const All = defineRoute('ALL');

// Parameter decorators
type ParamExtractor = (ctx: any) => any;
function paramFactory(extractor: ParamExtractor): () => ParameterDecorator {
  return () => (target, propertyKey, index) => {
    const Ctor = (target as any).constructor;
    const map: Record<string, { index: number; pick: ParamExtractor }[]> =
      Reflect.getMetadata(META_PARAMS, Ctor) ?? {};
    const list = map[propertyKey as string] ?? [];
    list.push({ index, pick: extractor });
    map[propertyKey as string] = list;
    Reflect.defineMetadata(META_PARAMS, map, Ctor);
  };
}
export const Param = paramFactory(ctx => ctx.params);
export const Body = paramFactory(ctx => ctx.body);
export const Query = paramFactory(ctx => ctx.query);
export const Headers = paramFactory(ctx => ctx.headers);
export const Req = paramFactory(ctx => ctx);

