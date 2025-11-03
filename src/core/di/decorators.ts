import 'reflect-metadata';

const META_INJECTABLE = Symbol('di:injectable');
const META_PARAMTYPES = 'design:paramtypes';
const META_INJECT_TOKENS = Symbol('di:inject:tokens');
const META_PROVIDE = Symbol('di:provide');

export type Token<T = any> = string | symbol | (new (...args: any[]) => T);

export function Injectable(token?: Token): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(META_INJECTABLE, true, target);
    if (token) Reflect.defineMetadata(META_PROVIDE, token, target);
  };
}

export function Inject(token?: Token): ParameterDecorator & PropertyDecorator {
  return (target: any, propertyKey?: string | symbol, parameterIndex?: number) => {
    if (typeof parameterIndex === 'number') {
      const map: Map<number, Token> = Reflect.getMetadata(META_INJECT_TOKENS, target) ?? new Map();
      map.set(parameterIndex, token!);
      Reflect.defineMetadata(META_INJECT_TOKENS, map, target);
    } else if (propertyKey) {
      const props: Map<string | symbol, Token> =
        Reflect.getMetadata(META_INJECT_TOKENS, target.constructor) ?? new Map();
      props.set(propertyKey, token!);
      Reflect.defineMetadata(META_INJECT_TOKENS, props, target.constructor);
    }
  };
}

export function getInjectionTokensForCtor(target: any): Map<number, Token> {
  return Reflect.getMetadata(META_INJECT_TOKENS, target) ?? new Map<number, Token>();
}
export function getInjectionTokensForProps(target: any): Map<string | symbol, Token> {
  return Reflect.getMetadata(META_INJECT_TOKENS, target) ?? new Map<string | symbol, Token>();
}
export function isInjectable(target: any) {
  return Reflect.getMetadata(META_INJECTABLE, target) === true;
}
export function getProvideToken(target: any): Token | undefined {
  return Reflect.getMetadata(META_PROVIDE, target);
}

export { META_PARAMTYPES };
