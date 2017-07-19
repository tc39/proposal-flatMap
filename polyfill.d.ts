interface ReadonlyArray<T> {
  flatMap<U, This = undefined> (callback: (this: This, value: T, index: number, array: T[]) => U|U[], thisArg?: This): U[]

  // adding more overloads would be a combinatorial explosion
  flatten<U>(this:
    ReadonlyArray<U[][]> |
    ReadonlyArray<ReadonlyArray<U[]>> |
    ReadonlyArray<ReadonlyArray<U>[]> |
    ReadonlyArray<ReadonlyArray<ReadonlyArray<U>>>,
    depth: 2): U[];
  flatten<U>(this: ReadonlyArray<U[]> | ReadonlyArray<ReadonlyArray<U>>, depth?: 1): U[];
  flatten<U>(this: ReadonlyArray<U>, depth: 0): U[];
  flatten<U>(depth: number): U[];
}


interface Array<T> {
  flatMap<U, This = undefined> (callback: (this: This, value: T, index: number, array: T[]) => U|U[], thisArg?: This): U[]

  flatten<U>(this: U[][][][][][][][], depth: 7): U[];
  flatten<U>(this: U[][][][][][][], depth: 6): U[];
  flatten<U>(this: U[][][][][][], depth: 5): U[];
  flatten<U>(this: U[][][][][], depth: 4): U[];
  flatten<U>(this: U[][][][], depth: 3): U[];
  flatten<U>(this: U[][][], depth: 2): U[];
  flatten<U>(this: U[][], depth?: 1): U[];
  flatten<U>(this: U[], depth: 0): U[];
  flatten<U>(depth?: number): U[];
}
