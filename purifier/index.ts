type promsieFn = (...args: any[]) => Promise<any>;
type adaptor<A, B> = (val: A, k: (val: B) => void) => void;
const getUuid = () => new Error().stack!.split("at ")[3];

const preparam = <P, T>(prefix: P, fn: (val: P, val2: T) => void) => (
  val: T
) => {
  fn(prefix, val);
};

const valueMap: Record<string, { isCompleted: true; value: any }> = {};
const adaptPromiseFunction = <A extends any[], T>(
  fn: (...args: A) => Promise<T>
): ((...args: A) => T) => {
  return function (...args) {
    const uuid = getUuid();
    const state = valueMap[uuid];
    if (state && state.isCompleted) {
      return state.value as T;
    } else
      throw {
        args,
        fn,
        uuid
      };
  };
};

type MapArgs<Args extends any[]> = {
  [Index in keyof Args]: Args[Index] extends (...args: infer Args) => infer U
    ? (...args: Args) => Promise<U>
    : Args[Index];
};

const runAsPure = async <R>(runner: () => R): Promise<R> => {
  try {
    const res = runner();
    return res;
  } catch (e) {
    if (e.fn) {
      const promise: Promise<any> = e.fn(...e.args); // Promise
      const value = await promise;
      valueMap[e.uuid] = {
        isCompleted: true,
        value
      };
      return await runAsPure(runner);
    } else throw e;
  }
};

const asPure = <A extends any[], R>(
  fn: (...args: A) => R
): ((...args: MapArgs<A>) => Promise<R>) => {
  return (...args: any[]) => {
    const newArgs = args.map((arg) =>
      typeof arg == "function" ? adaptPromiseFunction(arg) : arg
    ) as any;
    return runAsPure(() => fn(...newArgs));
  };
};

type User = {
  id: string;
  name: string;
};
type SaveUser = (user: User) => void;
type GetUser = (id: string) => User | undefined;
type UpdateUserDependencies = {
  saveUser: SaveUser;
  getUser: GetUser;
};

const updateUser = (
  saveUser: SaveUser,
  getUser: GetUser,
  name: string,
  id: string
) => {
  const user = getUser(id);
  if (!user) throw new Error("No user found with id" + id);
  const updatedUser = {
    ...user,
    name
  };
  saveUser(updatedUser);
  return updatedUser;
};

const saveUserToFirebase = async (user: User) => {
  // saved to db
};

const getUserFromFirebase = async (id: string) =>
  id === "1"
    ? ({
        id,
        name: "jason"
      } as User)
    : undefined;

const adaptedDeps = {
  saveUser: adaptPromiseFunction(saveUserToFirebase),
  getUser: adaptPromiseFunction(getUserFromFirebase)
};
const res = runAsPure(() => {
  return updateUser(
    adaptedDeps.saveUser,
    adaptedDeps.getUser,
    "not_jason",
    "5"
  );
})
  .then(preparam("res 1", console.log))
  .catch(preparam("res 1", console.error));

const sla = asPure(updateUser)(
  saveUserToFirebase,
  getUserFromFirebase,
  "not_jason",
  "1"
)
  .then(preparam("res 2", console.log))
  .catch(preparam("res 2", console.log));
