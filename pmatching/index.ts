const $witch = <T>(val: any, ...matchers: (() => T)[]) => {};

interface Klass<T> {
  new (...args: any): T;
}

type makeResultObject<T extends object> = {
  [P in keyof T]: T[P] extends Klass<infer U> ? U : T[P];
};
type makeResult<T> = T extends Klass<infer U>
  ? U
  : T extends object
  ? makeResultObject<T>
  : T;

// type Matcher<O, A> = <T extends object, V = makeResult<T>>(
//   pattern: T,
//   val: (value: O extends V ? O : never) => A
// ) => boolean;

type Matcher<O> = (value: O) => any;

type Narrowable = string | number | bigint | boolean | [];

type Const<A, W = unknown> =
  | (A extends Narrowable ? A : never)
  | { [K in keyof A]: ConstAt<A, W, K> };

type ConstAt<A, W, K extends keyof A> = K extends keyof W
  ? W[K] extends Widen<infer T>
    ? T
    : Const<A[K], W[K]>
  : Const<A[K], {}>;

type Widen<A = unknown> = { [type]: A };

declare const type: unique symbol;

export type Primitives =
  | number
  | boolean
  | string
  | undefined
  | null
  | symbol
  | bigint;

function match<O, A>(owo: O, ...matchers: Matcher<O>[]): any {
  return 0 as any;
}
function on<A, P extends object, R, M>(
  pattern: Const<P>,
  val: (value: A extends makeResult<P> ? A : never) => R
): (value: A) => R;
function on<A, P extends Primitives, R>(
  pattern: Const<P>,
  val: (value: A extends P ? A : never) => R
): (value: A) => R;
function on<A, R>(
  pattern: Klass<R>,
  val: (value: A extends R ? A : never) => R
): (value: A) => R;
// function on<O, A, U extends any[], T extends readonly [...U]>(
//   pattern: T,
//   val: (value: O extends T ? O : never) => A
// );
function on(any: any, any2: any): any {
  return 0 as any;
}
function otherwise<A, R>(val: (value: A) => R): (value: A) => R {
  return 0 as any;
}

type Card = {
  type: "card";
  hi: true;
};
type Boleto = {
  type: "boleto";
  oi: false;
};

type Input = Card | Boleto;

type Input2 = number[];
const matchCard = match(
  (0 as any) as any,
  on({ type: "card" }, (e) => {
    return e.hi;
  }),
  on({ type: "boleto" }, (boleto) => boleto.oi)
  //   otherwise((val) => "done")
);

type sla = number[] extends [1, 1] ? true : false;

function matchUnkown(...matchers: any[]): (val: unknown) => any {
  return 0 as any;
}
function on_<A, P extends object, R>(
  pattern: Const<P>,
  val: (value: P) => R
): (value: A) => R {
  return 0 as any;
}
const string = (Symbol() as any) as string;
const matchCard2 = matchUnkown(
  on_({ type: "card", hi: string }, (e) => {
    return e.hi;
  }),
  on_({ type: "boleto", oi: string }, (boleto) => boleto.oi)
  //   otherwise((val) => "done")
);
