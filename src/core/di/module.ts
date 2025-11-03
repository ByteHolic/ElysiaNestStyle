import type { Elysia } from 'elysia';
import { Container, type Provider } from './container';
import { mountControllers } from '../http/mount';

const META_MODULE = Symbol('di:module');
export interface ModuleMeta {
  imports?: any[];
  providers?: (Provider | (new (...args: any[]) => any))[];
  controllers?: any[];
  exports?: (string | symbol | Function)[];
  prefix?: string;
}

export const Module = (meta: ModuleMeta): ClassDecorator => (target: any) => {
  Reflect.defineMetadata(META_MODULE, meta, target);
};

export function getModuleMeta(target: any): ModuleMeta {
  return Reflect.getMetadata(META_MODULE, target) ?? {};
}

// Recursively collects all controllers in the module tree
function collectControllers(moduleClass: any): any[] {
  const meta = getModuleMeta(moduleClass);
  let controllers = [...(meta.controllers ?? [])];
  for (const imported of meta.imports ?? []) {
    controllers = controllers.concat(collectControllers(imported));
  }
  return controllers;
}

// Recursively registers all providers in the module tree
function registerProvidersRecursive(container: Container, moduleClass: any) {
  const meta = getModuleMeta(moduleClass);
  container.register(meta.providers ?? []);
  for (const imported of meta.imports ?? []) {
    registerProvidersRecursive(container, imported);
  }
}

export function mountModule(app: Elysia, ModuleClass: any, parent?: Container) {
  const meta = getModuleMeta(ModuleClass);
  const container = new Container(parent);
  registerProvidersRecursive(container, ModuleClass);
  const allControllers = collectControllers(ModuleClass);
  mountControllers(app, allControllers, container);

  for (const tok of meta.exports ?? []) {
    container.register([{ provide: tok as any, useFactory: (c) => c.resolve(tok as any) }]);
  }
  return { app, container };
}
