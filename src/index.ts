/**
 * Banshi
 */

export type BanshiCallstack = (symbol | string | any[])[];

export type BanshiExecute = (callstack: BanshiCallstack) => Promise<any>;

export class BanshiConnected<R> {
  private readonly execute: BanshiExecute;

  constructor(execute: BanshiExecute) {
    this.execute = execute;
  }

  async $<T>(cast: (resource: R) => T): Promise<T> {
    const callstack: BanshiCallstack = [];

    const proxy: R = new Proxy((() => { }) as any, {
      get(target, prop, receiver) {
        callstack.push(prop);

        return proxy;
      },
      apply(target, thisArg, argArray) {
        callstack.push(argArray);

        return proxy;
      },
    });

    cast(proxy);

    return await this.execute(callstack);
  }
}

export class BanshiResource<R> {
  private readonly resource: R;

  constructor(resource: R) {
    this.resource = resource;
  }

  async $<T>(callstack: BanshiCallstack): Promise<T> {
    const result = {
      pointer: this.resource as any,
      context: this.resource as any,
    };

    for (const stackPart of callstack) {
      const actualPointer = await result.pointer;

      if (Array.isArray(stackPart)) {
        result.pointer = actualPointer.apply(result.context, stackPart);
      } else {
        result.pointer = actualPointer[stackPart];
        result.context = actualPointer;
      }
    }

    return await result.pointer;
  }
}
