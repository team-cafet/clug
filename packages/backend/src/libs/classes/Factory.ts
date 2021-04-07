import { IFactory } from '../interfaces/IFactory';

export class Factory {
  public static createMany<T>(number:number, factory:IFactory<T>): T[]{
    const elements = [];
         
    for (let i = 0; i < number; i++) {
      elements.push(factory.define()); 
    }

    return elements;
  }
}
