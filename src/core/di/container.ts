import 'reflect-metadata';
import {
  META_PARAMTYPES,
  getInjectionTokensForCtor,
  getInjectionTokensForProps,
  getProvideToken,
  type Token
} from './decorators';

export type Provider<T = any> =
  | { provide: Token<T>; useClass: new (...args: any[]) => T; scope?: 'singleton' | 'transient' }
  | { provide: Token<T>; useValue: T }
  | { provide: Token<T>; useFactory: (c: Container) => T; scope?: 'singleton' | 'transient' };

export class Container {
  private registry = new Map<Token, Provider>();
  private singletons = new Map<Token, any>();
  constructor(private parent?: Container) {}

  register(providers: (Provider | (new (...args: any[]) => any))[] = []) {
    for (const p of providers) {
      if (typeof p === 'function') {
        const token = getProvideToken(p) ?? p;
        this.registry.set(token, { provide: token, useClass: p, scope: 'singleton' });
      } else {
        this.registry.set(p.provide, p);
      }
    }
    return this;
  }

  child() { return new Container(this); }

  resolve<T>(token: Token<T>): T {
    if (this.singletons.has(token)) return this.singletons.get(token);

    let provider = this.registry.get(token);
    if (!provider && typeof token === 'function') {
      provider = { provide: token, useClass: token, scope: 'singleton' };
      this.registry.set(token, provider);
    }

    if (!provider && this.parent) return this.parent.resolve(token);
    if (!provider) throw new Error(`DI: no provider for token ${String(token)}`);

    let instance: T;
    if ('useValue' in provider) instance = provider.useValue as T;
    else if ('useFactory' in provider) instance = provider.useFactory(this) as T;
    else if ('useClass' in provider) instance = this.construct(provider.useClass);
    else throw new Error('Provider is not valid');

    if (!('useValue' in provider) && (provider as any).scope !== 'transient') {
      this.singletons.set(provider.provide, instance);
    }
    return instance;
  }

  private construct<T>(Cls: new (...args: any[]) => T): T {
    const paramTypes: any[] = Reflect.getMetadata(META_PARAMTYPES, Cls) ?? [];
    const overrides: Map<number, Token> = getInjectionTokensForCtor(Cls.prototype);
    const args = paramTypes.map((ptype, index) => {
      const token = overrides.get(index) ?? ptype;
      return this.resolve(token);
    });
    const obj: any = new Cls(...args);

    const propTokens: Map<string | symbol, Token> = getInjectionTokensForProps(Cls);
    for (const [prop, token] of propTokens.entries()) {
      obj[prop] = this.resolve(token);
    }
    return obj;
  }
}
