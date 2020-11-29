type DeepUnpromisifyObject<T> = T extends Function
  ? T
  : T extends Promise<infer P1>
  ? { 0: P1; 1: DeepUnpromisifyObject<P1> }[P1 extends Array<infer A>
      ? 1
      : P1 extends Function
      ? 1
      : P1 extends object
      ? 1
      : 0]
  : T extends object
  ? {
      [p in keyof T]: DeepUnpromisifyObject<T[p]>;
    }
  : T;
async function resolve<T extends any[]>(
  promises: T
): Promise<DeepUnpromisifyObject<T>>;
async function resolve<T extends object>(
  promises: T
): Promise<DeepUnpromisifyObject<T>>;
async function resolve<T extends any[]>(
  ...promises: T
): Promise<DeepUnpromisifyObject<T>>;
async function resolve<T>(...args: any[]): Promise<DeepUnpromisifyObject<T>> {
  const promises = args.length === 1 ? args[0] : args;
  // console.log('calling r', promises)
  return (await _recursiveResolve(promises)) as any;
}

async function _recursiveResolve<T>(
  promises: T
): Promise<DeepUnpromisifyObject<T>> {
  const value = await Promise.resolve(promises);
  if (Array.isArray(value)) {
    return Promise.all(value.map(_recursiveResolve)) as any;
  } else if (typeof value === "object") {
    const values: Record<string, any> = {};
    for (const prop in value) {
      values[prop] = await _recursiveResolve(value[prop]);
    }
    // const values = Object.values(value).map(deepResolve);
    return values as any;
  }
  return value as any;
}

const res = resolve({
  number: Promise.resolve(5),
  hey: [Promise.resolve(5 as const), Promise.resolve(10 as const)] as const,
  hello: Promise.resolve({
    name: Promise.resolve("hi" as const),
  }),
});
