interface ReadonlyArray<T> {
  flatMap<U, This = undefined> (callback: (this: This, value: T, index: number, array: T[]) => U|U[], thisArg: This = undefined): U[]

  flatten (depth: 0): T[]
  flatten<U extends any[]> (this: U[], depth?: 1 = 1): U
  flatten<U extends any[]> (this: U[][], depth: 2): U
  flatten<U extends any[]> (this: U[][][], depth: 3): U
  flatten<U extends any[]> (this: U[][][][], depth: 4): U
  flatten<U> (depth?: number = 1): U[]
}

interface Array<T> {
  flatMap<U, This = undefined> (callback: (this: This, value: T, index: number, array: T[]) => U|U[], thisArg: This = undefined): U[]

  flatten (depth: 0): T[]
  flatten<U extends any[]> (this: U[], depth?: 1 = 1): U
  flatten<U extends any[]> (this: U[][], depth: 2): U
  flatten<U extends any[]> (this: U[][][], depth: 3): U
  flatten<U extends any[]> (this: U[][][][], depth: 4): U
  flatten<U> (depth?: number = 1): U[]
}
