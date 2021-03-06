import { ComponentFactoryResolver, Injector, NgModule } from '@angular/core';

import {
  componentDefsToDeclarations,
  createCustomElementFor,
} from './custom-element-factory';
import { WebComponentDeclaration, WebComponentDefs } from './types';

@NgModule({})
export abstract class CustomElementModule {
  protected abstract components: WebComponentDefs;

  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    this.init();
  }

  private init() {
    const componentDeclarations = componentDefsToDeclarations(this.components);

    componentDeclarations.forEach(componentDeclaration =>
      this.register(componentDeclaration),
    );
  }

  private register(componentDeclaration: WebComponentDeclaration) {
    customElements.define(
      this.getComponentName(componentDeclaration),
      createCustomElementFor(componentDeclaration, this.injector),
    );
  }

  private getComponentName(componentDeclaration: WebComponentDeclaration) {
    if (componentDeclaration.selector) {
      return componentDeclaration.selector;
    }

    return this.injector
      .get(ComponentFactoryResolver)
      .resolveComponentFactory(componentDeclaration.component).selector;
  }
}
