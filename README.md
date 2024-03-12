# Banshi

[![version](https://img.shields.io/npm/v/banshi.svg?style=flat-square&logo=npm)](https://npmjs.com/package/banshi)
[![size](https://img.shields.io/bundlephobia/min/banshi.svg?style=flat-square&logo=npm)](https://npmjs.com/package/banshi)
[![license](https://img.shields.io/npm/l/banshi.svg?style=flat-square&logo=npm)](https://npmjs.com/package/banshi)
[![downloads](https://img.shields.io/npm/dm/banshi.svg?style=flat-square&logo=npm)](https://npmjs.com/package/banshi)

## Installing

Using npm:

```bash
npm install banshi
```

## Getting started

Integration example:

```typescript
const run = async () => {
  class MockEndpoint<P = any, D = any> {
    constructor(private onRequest: (payload: P) => Promise<D>) { }

    async sendRequest(payload: P) {
      const data = await this.onRequest(payload);

      console.log(`Request payload: ${JSON.stringify(payload)}`);
      console.log(`Request data: ${JSON.stringify(data)}`);

      return data;
    }
  }

  class Car {
    constructor(private brand: string) { }

    getBrand() {
      return this.brand;
    }
  }

  const car = new Car("Tesla");

  const resourceRemote = new BanshiResource<Car>(car);

  const endpoint = new MockEndpoint(async (payload) => {
    return await resourceRemote.$(payload);
  });

  const resourceConnected = new BanshiConnected<Car>(async (callstack) => {
    return endpoint.sendRequest(callstack);
  });

  const result = await resourceConnected.$((resource) => {
    return resource.getBrand();
  });

  console.log(result);
};

run();
```
