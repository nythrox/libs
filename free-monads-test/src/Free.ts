import { Type, URIS } from "purifree-ts";

class Free<URI extends URIS, A> {
  URI: "Free";
  Monad: URI;

  A: A;

  //   chain<B extends any[], URI2 extends PropertyKey>(
  //     chainer: (a: A[0]) => Free<URI2, B>,
  //   ): Free<URI2, B> {}

  //   map<B>(mapper: (a: A[0]) => B): Free<URI, [B]> {}
}

class Pure<URI extends URIS, A> extends Free<URI, A> {
  constructor(private value: A) {
    super();
  }
  chain<B, URI2 extends URIS>(
    chainer: (value: A) => Free<URI2, B>,
  ): Free<URI2, B> {
    return chainer(this.value);
  }
}

class Impure<URI extends URIS, A> extends Free<URI, A> {
  constructor(private next: Type<URI, [Free<URI, A>]>) {
    super();
  }
  chain<B, URI2 extends URIS>(
    chainer: (value: A) => Free<URI2, B>,
  ): Free<URI2, B> {
    return new Impure(
      (this.next as any).map((free: any) => free.chain(chainer)),
    );
  }
}

function getFree<M extends MakeFree<any, any>>() {
  return (...args: M["A"]): M => {
    return {
      pure: true,
      params: args,
    } as any;
  };
}

type MakeFree<URI extends PropertyKey, Args extends any[]> = Free<URI, Args>;

interface ConsoleLog extends MakeFree<"ConsoleLog", [name: string]> {}

const consoleLog = getFree<ConsoleLog>();
