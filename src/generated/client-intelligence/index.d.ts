
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SourceProfile
 * 
 */
export type SourceProfile = $Result.DefaultSelection<Prisma.$SourceProfilePayload>
/**
 * Model CrawlEvent
 * 
 */
export type CrawlEvent = $Result.DefaultSelection<Prisma.$CrawlEventPayload>
/**
 * Model SourceSnapshot
 * 
 */
export type SourceSnapshot = $Result.DefaultSelection<Prisma.$SourceSnapshotPayload>
/**
 * Model ObservedListing
 * 
 */
export type ObservedListing = $Result.DefaultSelection<Prisma.$ObservedListingPayload>
/**
 * Model Signal
 * 
 */
export type Signal = $Result.DefaultSelection<Prisma.$SignalPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SourceProfiles
 * const sourceProfiles = await prisma.sourceProfile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more SourceProfiles
   * const sourceProfiles = await prisma.sourceProfile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs, $Utils.Call<Prisma.TypeMapCb, {
    extArgs: ExtArgs
  }>, ClientOptions>

      /**
   * `prisma.sourceProfile`: Exposes CRUD operations for the **SourceProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SourceProfiles
    * const sourceProfiles = await prisma.sourceProfile.findMany()
    * ```
    */
  get sourceProfile(): Prisma.SourceProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.crawlEvent`: Exposes CRUD operations for the **CrawlEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CrawlEvents
    * const crawlEvents = await prisma.crawlEvent.findMany()
    * ```
    */
  get crawlEvent(): Prisma.CrawlEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sourceSnapshot`: Exposes CRUD operations for the **SourceSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SourceSnapshots
    * const sourceSnapshots = await prisma.sourceSnapshot.findMany()
    * ```
    */
  get sourceSnapshot(): Prisma.SourceSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.observedListing`: Exposes CRUD operations for the **ObservedListing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ObservedListings
    * const observedListings = await prisma.observedListing.findMany()
    * ```
    */
  get observedListing(): Prisma.ObservedListingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.signal`: Exposes CRUD operations for the **Signal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Signals
    * const signals = await prisma.signal.findMany()
    * ```
    */
  get signal(): Prisma.SignalDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.4.0
   * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    SourceProfile: 'SourceProfile',
    CrawlEvent: 'CrawlEvent',
    SourceSnapshot: 'SourceSnapshot',
    ObservedListing: 'ObservedListing',
    Signal: 'Signal'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "sourceProfile" | "crawlEvent" | "sourceSnapshot" | "observedListing" | "signal"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SourceProfile: {
        payload: Prisma.$SourceProfilePayload<ExtArgs>
        fields: Prisma.SourceProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SourceProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SourceProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>
          }
          findFirst: {
            args: Prisma.SourceProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SourceProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>
          }
          findMany: {
            args: Prisma.SourceProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>[]
          }
          create: {
            args: Prisma.SourceProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>
          }
          createMany: {
            args: Prisma.SourceProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SourceProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>[]
          }
          delete: {
            args: Prisma.SourceProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>
          }
          update: {
            args: Prisma.SourceProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>
          }
          deleteMany: {
            args: Prisma.SourceProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SourceProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SourceProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>[]
          }
          upsert: {
            args: Prisma.SourceProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceProfilePayload>
          }
          aggregate: {
            args: Prisma.SourceProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSourceProfile>
          }
          groupBy: {
            args: Prisma.SourceProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<SourceProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.SourceProfileCountArgs<ExtArgs>
            result: $Utils.Optional<SourceProfileCountAggregateOutputType> | number
          }
        }
      }
      CrawlEvent: {
        payload: Prisma.$CrawlEventPayload<ExtArgs>
        fields: Prisma.CrawlEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CrawlEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CrawlEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>
          }
          findFirst: {
            args: Prisma.CrawlEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CrawlEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>
          }
          findMany: {
            args: Prisma.CrawlEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>[]
          }
          create: {
            args: Prisma.CrawlEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>
          }
          createMany: {
            args: Prisma.CrawlEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CrawlEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>[]
          }
          delete: {
            args: Prisma.CrawlEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>
          }
          update: {
            args: Prisma.CrawlEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>
          }
          deleteMany: {
            args: Prisma.CrawlEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CrawlEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CrawlEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>[]
          }
          upsert: {
            args: Prisma.CrawlEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrawlEventPayload>
          }
          aggregate: {
            args: Prisma.CrawlEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCrawlEvent>
          }
          groupBy: {
            args: Prisma.CrawlEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<CrawlEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.CrawlEventCountArgs<ExtArgs>
            result: $Utils.Optional<CrawlEventCountAggregateOutputType> | number
          }
        }
      }
      SourceSnapshot: {
        payload: Prisma.$SourceSnapshotPayload<ExtArgs>
        fields: Prisma.SourceSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SourceSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SourceSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>
          }
          findFirst: {
            args: Prisma.SourceSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SourceSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>
          }
          findMany: {
            args: Prisma.SourceSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>[]
          }
          create: {
            args: Prisma.SourceSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>
          }
          createMany: {
            args: Prisma.SourceSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SourceSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>[]
          }
          delete: {
            args: Prisma.SourceSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>
          }
          update: {
            args: Prisma.SourceSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.SourceSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SourceSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SourceSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.SourceSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceSnapshotPayload>
          }
          aggregate: {
            args: Prisma.SourceSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSourceSnapshot>
          }
          groupBy: {
            args: Prisma.SourceSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SourceSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SourceSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<SourceSnapshotCountAggregateOutputType> | number
          }
        }
      }
      ObservedListing: {
        payload: Prisma.$ObservedListingPayload<ExtArgs>
        fields: Prisma.ObservedListingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObservedListingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObservedListingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>
          }
          findFirst: {
            args: Prisma.ObservedListingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObservedListingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>
          }
          findMany: {
            args: Prisma.ObservedListingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>[]
          }
          create: {
            args: Prisma.ObservedListingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>
          }
          createMany: {
            args: Prisma.ObservedListingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObservedListingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>[]
          }
          delete: {
            args: Prisma.ObservedListingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>
          }
          update: {
            args: Prisma.ObservedListingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>
          }
          deleteMany: {
            args: Prisma.ObservedListingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObservedListingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ObservedListingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>[]
          }
          upsert: {
            args: Prisma.ObservedListingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservedListingPayload>
          }
          aggregate: {
            args: Prisma.ObservedListingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObservedListing>
          }
          groupBy: {
            args: Prisma.ObservedListingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObservedListingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObservedListingCountArgs<ExtArgs>
            result: $Utils.Optional<ObservedListingCountAggregateOutputType> | number
          }
        }
      }
      Signal: {
        payload: Prisma.$SignalPayload<ExtArgs>
        fields: Prisma.SignalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SignalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SignalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>
          }
          findFirst: {
            args: Prisma.SignalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SignalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>
          }
          findMany: {
            args: Prisma.SignalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>[]
          }
          create: {
            args: Prisma.SignalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>
          }
          createMany: {
            args: Prisma.SignalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SignalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>[]
          }
          delete: {
            args: Prisma.SignalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>
          }
          update: {
            args: Prisma.SignalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>
          }
          deleteMany: {
            args: Prisma.SignalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SignalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SignalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>[]
          }
          upsert: {
            args: Prisma.SignalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalPayload>
          }
          aggregate: {
            args: Prisma.SignalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSignal>
          }
          groupBy: {
            args: Prisma.SignalGroupByArgs<ExtArgs>
            result: $Utils.Optional<SignalGroupByOutputType>[]
          }
          count: {
            args: Prisma.SignalCountArgs<ExtArgs>
            result: $Utils.Optional<SignalCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    sourceProfile?: SourceProfileOmit
    crawlEvent?: CrawlEventOmit
    sourceSnapshot?: SourceSnapshotOmit
    observedListing?: ObservedListingOmit
    signal?: SignalOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SourceProfileCountOutputType
   */

  export type SourceProfileCountOutputType = {
    snapshots: number
    crawlEvents: number
  }

  export type SourceProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshots?: boolean | SourceProfileCountOutputTypeCountSnapshotsArgs
    crawlEvents?: boolean | SourceProfileCountOutputTypeCountCrawlEventsArgs
  }

  // Custom InputTypes
  /**
   * SourceProfileCountOutputType without action
   */
  export type SourceProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfileCountOutputType
     */
    select?: SourceProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SourceProfileCountOutputType without action
   */
  export type SourceProfileCountOutputTypeCountSnapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceSnapshotWhereInput
  }

  /**
   * SourceProfileCountOutputType without action
   */
  export type SourceProfileCountOutputTypeCountCrawlEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrawlEventWhereInput
  }


  /**
   * Count Type ObservedListingCountOutputType
   */

  export type ObservedListingCountOutputType = {
    signals: number
  }

  export type ObservedListingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    signals?: boolean | ObservedListingCountOutputTypeCountSignalsArgs
  }

  // Custom InputTypes
  /**
   * ObservedListingCountOutputType without action
   */
  export type ObservedListingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListingCountOutputType
     */
    select?: ObservedListingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ObservedListingCountOutputType without action
   */
  export type ObservedListingCountOutputTypeCountSignalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignalWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SourceProfile
   */

  export type AggregateSourceProfile = {
    _count: SourceProfileCountAggregateOutputType | null
    _avg: SourceProfileAvgAggregateOutputType | null
    _sum: SourceProfileSumAggregateOutputType | null
    _min: SourceProfileMinAggregateOutputType | null
    _max: SourceProfileMaxAggregateOutputType | null
  }

  export type SourceProfileAvgAggregateOutputType = {
    trustScore: number | null
  }

  export type SourceProfileSumAggregateOutputType = {
    trustScore: number | null
  }

  export type SourceProfileMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    baseUrl: string | null
    trustScore: number | null
    isEnabled: boolean | null
    config: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SourceProfileMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    baseUrl: string | null
    trustScore: number | null
    isEnabled: boolean | null
    config: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SourceProfileCountAggregateOutputType = {
    id: number
    name: number
    type: number
    baseUrl: number
    trustScore: number
    isEnabled: number
    config: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SourceProfileAvgAggregateInputType = {
    trustScore?: true
  }

  export type SourceProfileSumAggregateInputType = {
    trustScore?: true
  }

  export type SourceProfileMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    baseUrl?: true
    trustScore?: true
    isEnabled?: true
    config?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SourceProfileMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    baseUrl?: true
    trustScore?: true
    isEnabled?: true
    config?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SourceProfileCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    baseUrl?: true
    trustScore?: true
    isEnabled?: true
    config?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SourceProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceProfile to aggregate.
     */
    where?: SourceProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceProfiles to fetch.
     */
    orderBy?: SourceProfileOrderByWithRelationInput | SourceProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SourceProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SourceProfiles
    **/
    _count?: true | SourceProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SourceProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SourceProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SourceProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SourceProfileMaxAggregateInputType
  }

  export type GetSourceProfileAggregateType<T extends SourceProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateSourceProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSourceProfile[P]>
      : GetScalarType<T[P], AggregateSourceProfile[P]>
  }




  export type SourceProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceProfileWhereInput
    orderBy?: SourceProfileOrderByWithAggregationInput | SourceProfileOrderByWithAggregationInput[]
    by: SourceProfileScalarFieldEnum[] | SourceProfileScalarFieldEnum
    having?: SourceProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SourceProfileCountAggregateInputType | true
    _avg?: SourceProfileAvgAggregateInputType
    _sum?: SourceProfileSumAggregateInputType
    _min?: SourceProfileMinAggregateInputType
    _max?: SourceProfileMaxAggregateInputType
  }

  export type SourceProfileGroupByOutputType = {
    id: string
    name: string
    type: string
    baseUrl: string
    trustScore: number
    isEnabled: boolean
    config: string
    createdAt: Date
    updatedAt: Date
    _count: SourceProfileCountAggregateOutputType | null
    _avg: SourceProfileAvgAggregateOutputType | null
    _sum: SourceProfileSumAggregateOutputType | null
    _min: SourceProfileMinAggregateOutputType | null
    _max: SourceProfileMaxAggregateOutputType | null
  }

  type GetSourceProfileGroupByPayload<T extends SourceProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SourceProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SourceProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SourceProfileGroupByOutputType[P]>
            : GetScalarType<T[P], SourceProfileGroupByOutputType[P]>
        }
      >
    >


  export type SourceProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    baseUrl?: boolean
    trustScore?: boolean
    isEnabled?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    snapshots?: boolean | SourceProfile$snapshotsArgs<ExtArgs>
    crawlEvents?: boolean | SourceProfile$crawlEventsArgs<ExtArgs>
    _count?: boolean | SourceProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sourceProfile"]>

  export type SourceProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    baseUrl?: boolean
    trustScore?: boolean
    isEnabled?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sourceProfile"]>

  export type SourceProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    baseUrl?: boolean
    trustScore?: boolean
    isEnabled?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sourceProfile"]>

  export type SourceProfileSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    baseUrl?: boolean
    trustScore?: boolean
    isEnabled?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SourceProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "baseUrl" | "trustScore" | "isEnabled" | "config" | "createdAt" | "updatedAt", ExtArgs["result"]["sourceProfile"]>
  export type SourceProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshots?: boolean | SourceProfile$snapshotsArgs<ExtArgs>
    crawlEvents?: boolean | SourceProfile$crawlEventsArgs<ExtArgs>
    _count?: boolean | SourceProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SourceProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SourceProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SourceProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SourceProfile"
    objects: {
      snapshots: Prisma.$SourceSnapshotPayload<ExtArgs>[]
      crawlEvents: Prisma.$CrawlEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      baseUrl: string
      trustScore: number
      isEnabled: boolean
      config: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sourceProfile"]>
    composites: {}
  }

  type SourceProfileGetPayload<S extends boolean | null | undefined | SourceProfileDefaultArgs> = $Result.GetResult<Prisma.$SourceProfilePayload, S>

  type SourceProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SourceProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SourceProfileCountAggregateInputType | true
    }

  export interface SourceProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SourceProfile'], meta: { name: 'SourceProfile' } }
    /**
     * Find zero or one SourceProfile that matches the filter.
     * @param {SourceProfileFindUniqueArgs} args - Arguments to find a SourceProfile
     * @example
     * // Get one SourceProfile
     * const sourceProfile = await prisma.sourceProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SourceProfileFindUniqueArgs>(args: SelectSubset<T, SourceProfileFindUniqueArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one SourceProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SourceProfileFindUniqueOrThrowArgs} args - Arguments to find a SourceProfile
     * @example
     * // Get one SourceProfile
     * const sourceProfile = await prisma.sourceProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SourceProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, SourceProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first SourceProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceProfileFindFirstArgs} args - Arguments to find a SourceProfile
     * @example
     * // Get one SourceProfile
     * const sourceProfile = await prisma.sourceProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SourceProfileFindFirstArgs>(args?: SelectSubset<T, SourceProfileFindFirstArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first SourceProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceProfileFindFirstOrThrowArgs} args - Arguments to find a SourceProfile
     * @example
     * // Get one SourceProfile
     * const sourceProfile = await prisma.sourceProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SourceProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, SourceProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more SourceProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SourceProfiles
     * const sourceProfiles = await prisma.sourceProfile.findMany()
     * 
     * // Get first 10 SourceProfiles
     * const sourceProfiles = await prisma.sourceProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sourceProfileWithIdOnly = await prisma.sourceProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SourceProfileFindManyArgs>(args?: SelectSubset<T, SourceProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a SourceProfile.
     * @param {SourceProfileCreateArgs} args - Arguments to create a SourceProfile.
     * @example
     * // Create one SourceProfile
     * const SourceProfile = await prisma.sourceProfile.create({
     *   data: {
     *     // ... data to create a SourceProfile
     *   }
     * })
     * 
     */
    create<T extends SourceProfileCreateArgs>(args: SelectSubset<T, SourceProfileCreateArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many SourceProfiles.
     * @param {SourceProfileCreateManyArgs} args - Arguments to create many SourceProfiles.
     * @example
     * // Create many SourceProfiles
     * const sourceProfile = await prisma.sourceProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SourceProfileCreateManyArgs>(args?: SelectSubset<T, SourceProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SourceProfiles and returns the data saved in the database.
     * @param {SourceProfileCreateManyAndReturnArgs} args - Arguments to create many SourceProfiles.
     * @example
     * // Create many SourceProfiles
     * const sourceProfile = await prisma.sourceProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SourceProfiles and only return the `id`
     * const sourceProfileWithIdOnly = await prisma.sourceProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SourceProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, SourceProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a SourceProfile.
     * @param {SourceProfileDeleteArgs} args - Arguments to delete one SourceProfile.
     * @example
     * // Delete one SourceProfile
     * const SourceProfile = await prisma.sourceProfile.delete({
     *   where: {
     *     // ... filter to delete one SourceProfile
     *   }
     * })
     * 
     */
    delete<T extends SourceProfileDeleteArgs>(args: SelectSubset<T, SourceProfileDeleteArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one SourceProfile.
     * @param {SourceProfileUpdateArgs} args - Arguments to update one SourceProfile.
     * @example
     * // Update one SourceProfile
     * const sourceProfile = await prisma.sourceProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SourceProfileUpdateArgs>(args: SelectSubset<T, SourceProfileUpdateArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more SourceProfiles.
     * @param {SourceProfileDeleteManyArgs} args - Arguments to filter SourceProfiles to delete.
     * @example
     * // Delete a few SourceProfiles
     * const { count } = await prisma.sourceProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SourceProfileDeleteManyArgs>(args?: SelectSubset<T, SourceProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SourceProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SourceProfiles
     * const sourceProfile = await prisma.sourceProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SourceProfileUpdateManyArgs>(args: SelectSubset<T, SourceProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SourceProfiles and returns the data updated in the database.
     * @param {SourceProfileUpdateManyAndReturnArgs} args - Arguments to update many SourceProfiles.
     * @example
     * // Update many SourceProfiles
     * const sourceProfile = await prisma.sourceProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SourceProfiles and only return the `id`
     * const sourceProfileWithIdOnly = await prisma.sourceProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SourceProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, SourceProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one SourceProfile.
     * @param {SourceProfileUpsertArgs} args - Arguments to update or create a SourceProfile.
     * @example
     * // Update or create a SourceProfile
     * const sourceProfile = await prisma.sourceProfile.upsert({
     *   create: {
     *     // ... data to create a SourceProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SourceProfile we want to update
     *   }
     * })
     */
    upsert<T extends SourceProfileUpsertArgs>(args: SelectSubset<T, SourceProfileUpsertArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of SourceProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceProfileCountArgs} args - Arguments to filter SourceProfiles to count.
     * @example
     * // Count the number of SourceProfiles
     * const count = await prisma.sourceProfile.count({
     *   where: {
     *     // ... the filter for the SourceProfiles we want to count
     *   }
     * })
    **/
    count<T extends SourceProfileCountArgs>(
      args?: Subset<T, SourceProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SourceProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SourceProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SourceProfileAggregateArgs>(args: Subset<T, SourceProfileAggregateArgs>): Prisma.PrismaPromise<GetSourceProfileAggregateType<T>>

    /**
     * Group by SourceProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SourceProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SourceProfileGroupByArgs['orderBy'] }
        : { orderBy?: SourceProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SourceProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSourceProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SourceProfile model
   */
  readonly fields: SourceProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SourceProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SourceProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    snapshots<T extends SourceProfile$snapshotsArgs<ExtArgs> = {}>(args?: Subset<T, SourceProfile$snapshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "findMany", ClientOptions> | Null>
    crawlEvents<T extends SourceProfile$crawlEventsArgs<ExtArgs> = {}>(args?: Subset<T, SourceProfile$crawlEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "findMany", ClientOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SourceProfile model
   */ 
  interface SourceProfileFieldRefs {
    readonly id: FieldRef<"SourceProfile", 'String'>
    readonly name: FieldRef<"SourceProfile", 'String'>
    readonly type: FieldRef<"SourceProfile", 'String'>
    readonly baseUrl: FieldRef<"SourceProfile", 'String'>
    readonly trustScore: FieldRef<"SourceProfile", 'Int'>
    readonly isEnabled: FieldRef<"SourceProfile", 'Boolean'>
    readonly config: FieldRef<"SourceProfile", 'String'>
    readonly createdAt: FieldRef<"SourceProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"SourceProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SourceProfile findUnique
   */
  export type SourceProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * Filter, which SourceProfile to fetch.
     */
    where: SourceProfileWhereUniqueInput
  }

  /**
   * SourceProfile findUniqueOrThrow
   */
  export type SourceProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * Filter, which SourceProfile to fetch.
     */
    where: SourceProfileWhereUniqueInput
  }

  /**
   * SourceProfile findFirst
   */
  export type SourceProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * Filter, which SourceProfile to fetch.
     */
    where?: SourceProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceProfiles to fetch.
     */
    orderBy?: SourceProfileOrderByWithRelationInput | SourceProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceProfiles.
     */
    cursor?: SourceProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceProfiles.
     */
    distinct?: SourceProfileScalarFieldEnum | SourceProfileScalarFieldEnum[]
  }

  /**
   * SourceProfile findFirstOrThrow
   */
  export type SourceProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * Filter, which SourceProfile to fetch.
     */
    where?: SourceProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceProfiles to fetch.
     */
    orderBy?: SourceProfileOrderByWithRelationInput | SourceProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceProfiles.
     */
    cursor?: SourceProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceProfiles.
     */
    distinct?: SourceProfileScalarFieldEnum | SourceProfileScalarFieldEnum[]
  }

  /**
   * SourceProfile findMany
   */
  export type SourceProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * Filter, which SourceProfiles to fetch.
     */
    where?: SourceProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceProfiles to fetch.
     */
    orderBy?: SourceProfileOrderByWithRelationInput | SourceProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SourceProfiles.
     */
    cursor?: SourceProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceProfiles.
     */
    skip?: number
    distinct?: SourceProfileScalarFieldEnum | SourceProfileScalarFieldEnum[]
  }

  /**
   * SourceProfile create
   */
  export type SourceProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a SourceProfile.
     */
    data: XOR<SourceProfileCreateInput, SourceProfileUncheckedCreateInput>
  }

  /**
   * SourceProfile createMany
   */
  export type SourceProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SourceProfiles.
     */
    data: SourceProfileCreateManyInput | SourceProfileCreateManyInput[]
  }

  /**
   * SourceProfile createManyAndReturn
   */
  export type SourceProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * The data used to create many SourceProfiles.
     */
    data: SourceProfileCreateManyInput | SourceProfileCreateManyInput[]
  }

  /**
   * SourceProfile update
   */
  export type SourceProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a SourceProfile.
     */
    data: XOR<SourceProfileUpdateInput, SourceProfileUncheckedUpdateInput>
    /**
     * Choose, which SourceProfile to update.
     */
    where: SourceProfileWhereUniqueInput
  }

  /**
   * SourceProfile updateMany
   */
  export type SourceProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SourceProfiles.
     */
    data: XOR<SourceProfileUpdateManyMutationInput, SourceProfileUncheckedUpdateManyInput>
    /**
     * Filter which SourceProfiles to update
     */
    where?: SourceProfileWhereInput
    /**
     * Limit how many SourceProfiles to update.
     */
    limit?: number
  }

  /**
   * SourceProfile updateManyAndReturn
   */
  export type SourceProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * The data used to update SourceProfiles.
     */
    data: XOR<SourceProfileUpdateManyMutationInput, SourceProfileUncheckedUpdateManyInput>
    /**
     * Filter which SourceProfiles to update
     */
    where?: SourceProfileWhereInput
    /**
     * Limit how many SourceProfiles to update.
     */
    limit?: number
  }

  /**
   * SourceProfile upsert
   */
  export type SourceProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the SourceProfile to update in case it exists.
     */
    where: SourceProfileWhereUniqueInput
    /**
     * In case the SourceProfile found by the `where` argument doesn't exist, create a new SourceProfile with this data.
     */
    create: XOR<SourceProfileCreateInput, SourceProfileUncheckedCreateInput>
    /**
     * In case the SourceProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SourceProfileUpdateInput, SourceProfileUncheckedUpdateInput>
  }

  /**
   * SourceProfile delete
   */
  export type SourceProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
    /**
     * Filter which SourceProfile to delete.
     */
    where: SourceProfileWhereUniqueInput
  }

  /**
   * SourceProfile deleteMany
   */
  export type SourceProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceProfiles to delete
     */
    where?: SourceProfileWhereInput
    /**
     * Limit how many SourceProfiles to delete.
     */
    limit?: number
  }

  /**
   * SourceProfile.snapshots
   */
  export type SourceProfile$snapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    where?: SourceSnapshotWhereInput
    orderBy?: SourceSnapshotOrderByWithRelationInput | SourceSnapshotOrderByWithRelationInput[]
    cursor?: SourceSnapshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SourceSnapshotScalarFieldEnum | SourceSnapshotScalarFieldEnum[]
  }

  /**
   * SourceProfile.crawlEvents
   */
  export type SourceProfile$crawlEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    where?: CrawlEventWhereInput
    orderBy?: CrawlEventOrderByWithRelationInput | CrawlEventOrderByWithRelationInput[]
    cursor?: CrawlEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CrawlEventScalarFieldEnum | CrawlEventScalarFieldEnum[]
  }

  /**
   * SourceProfile without action
   */
  export type SourceProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceProfile
     */
    select?: SourceProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceProfile
     */
    omit?: SourceProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceProfileInclude<ExtArgs> | null
  }


  /**
   * Model CrawlEvent
   */

  export type AggregateCrawlEvent = {
    _count: CrawlEventCountAggregateOutputType | null
    _avg: CrawlEventAvgAggregateOutputType | null
    _sum: CrawlEventSumAggregateOutputType | null
    _min: CrawlEventMinAggregateOutputType | null
    _max: CrawlEventMaxAggregateOutputType | null
  }

  export type CrawlEventAvgAggregateOutputType = {
    itemsFound: number | null
    itemsNew: number | null
  }

  export type CrawlEventSumAggregateOutputType = {
    itemsFound: number | null
    itemsNew: number | null
  }

  export type CrawlEventMinAggregateOutputType = {
    id: string | null
    sourceId: string | null
    startTime: Date | null
    endTime: Date | null
    status: string | null
    itemsFound: number | null
    itemsNew: number | null
    errors: string | null
  }

  export type CrawlEventMaxAggregateOutputType = {
    id: string | null
    sourceId: string | null
    startTime: Date | null
    endTime: Date | null
    status: string | null
    itemsFound: number | null
    itemsNew: number | null
    errors: string | null
  }

  export type CrawlEventCountAggregateOutputType = {
    id: number
    sourceId: number
    startTime: number
    endTime: number
    status: number
    itemsFound: number
    itemsNew: number
    errors: number
    _all: number
  }


  export type CrawlEventAvgAggregateInputType = {
    itemsFound?: true
    itemsNew?: true
  }

  export type CrawlEventSumAggregateInputType = {
    itemsFound?: true
    itemsNew?: true
  }

  export type CrawlEventMinAggregateInputType = {
    id?: true
    sourceId?: true
    startTime?: true
    endTime?: true
    status?: true
    itemsFound?: true
    itemsNew?: true
    errors?: true
  }

  export type CrawlEventMaxAggregateInputType = {
    id?: true
    sourceId?: true
    startTime?: true
    endTime?: true
    status?: true
    itemsFound?: true
    itemsNew?: true
    errors?: true
  }

  export type CrawlEventCountAggregateInputType = {
    id?: true
    sourceId?: true
    startTime?: true
    endTime?: true
    status?: true
    itemsFound?: true
    itemsNew?: true
    errors?: true
    _all?: true
  }

  export type CrawlEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrawlEvent to aggregate.
     */
    where?: CrawlEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrawlEvents to fetch.
     */
    orderBy?: CrawlEventOrderByWithRelationInput | CrawlEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CrawlEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrawlEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrawlEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CrawlEvents
    **/
    _count?: true | CrawlEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CrawlEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CrawlEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CrawlEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CrawlEventMaxAggregateInputType
  }

  export type GetCrawlEventAggregateType<T extends CrawlEventAggregateArgs> = {
        [P in keyof T & keyof AggregateCrawlEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCrawlEvent[P]>
      : GetScalarType<T[P], AggregateCrawlEvent[P]>
  }




  export type CrawlEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrawlEventWhereInput
    orderBy?: CrawlEventOrderByWithAggregationInput | CrawlEventOrderByWithAggregationInput[]
    by: CrawlEventScalarFieldEnum[] | CrawlEventScalarFieldEnum
    having?: CrawlEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CrawlEventCountAggregateInputType | true
    _avg?: CrawlEventAvgAggregateInputType
    _sum?: CrawlEventSumAggregateInputType
    _min?: CrawlEventMinAggregateInputType
    _max?: CrawlEventMaxAggregateInputType
  }

  export type CrawlEventGroupByOutputType = {
    id: string
    sourceId: string
    startTime: Date
    endTime: Date | null
    status: string
    itemsFound: number
    itemsNew: number
    errors: string | null
    _count: CrawlEventCountAggregateOutputType | null
    _avg: CrawlEventAvgAggregateOutputType | null
    _sum: CrawlEventSumAggregateOutputType | null
    _min: CrawlEventMinAggregateOutputType | null
    _max: CrawlEventMaxAggregateOutputType | null
  }

  type GetCrawlEventGroupByPayload<T extends CrawlEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CrawlEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CrawlEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CrawlEventGroupByOutputType[P]>
            : GetScalarType<T[P], CrawlEventGroupByOutputType[P]>
        }
      >
    >


  export type CrawlEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    itemsFound?: boolean
    itemsNew?: boolean
    errors?: boolean
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crawlEvent"]>

  export type CrawlEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    itemsFound?: boolean
    itemsNew?: boolean
    errors?: boolean
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crawlEvent"]>

  export type CrawlEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    itemsFound?: boolean
    itemsNew?: boolean
    errors?: boolean
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crawlEvent"]>

  export type CrawlEventSelectScalar = {
    id?: boolean
    sourceId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    itemsFound?: boolean
    itemsNew?: boolean
    errors?: boolean
  }

  export type CrawlEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceId" | "startTime" | "endTime" | "status" | "itemsFound" | "itemsNew" | "errors", ExtArgs["result"]["crawlEvent"]>
  export type CrawlEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }
  export type CrawlEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }
  export type CrawlEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }

  export type $CrawlEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CrawlEvent"
    objects: {
      source: Prisma.$SourceProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceId: string
      startTime: Date
      endTime: Date | null
      status: string
      itemsFound: number
      itemsNew: number
      errors: string | null
    }, ExtArgs["result"]["crawlEvent"]>
    composites: {}
  }

  type CrawlEventGetPayload<S extends boolean | null | undefined | CrawlEventDefaultArgs> = $Result.GetResult<Prisma.$CrawlEventPayload, S>

  type CrawlEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CrawlEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CrawlEventCountAggregateInputType | true
    }

  export interface CrawlEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CrawlEvent'], meta: { name: 'CrawlEvent' } }
    /**
     * Find zero or one CrawlEvent that matches the filter.
     * @param {CrawlEventFindUniqueArgs} args - Arguments to find a CrawlEvent
     * @example
     * // Get one CrawlEvent
     * const crawlEvent = await prisma.crawlEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CrawlEventFindUniqueArgs>(args: SelectSubset<T, CrawlEventFindUniqueArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one CrawlEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CrawlEventFindUniqueOrThrowArgs} args - Arguments to find a CrawlEvent
     * @example
     * // Get one CrawlEvent
     * const crawlEvent = await prisma.crawlEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CrawlEventFindUniqueOrThrowArgs>(args: SelectSubset<T, CrawlEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first CrawlEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrawlEventFindFirstArgs} args - Arguments to find a CrawlEvent
     * @example
     * // Get one CrawlEvent
     * const crawlEvent = await prisma.crawlEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CrawlEventFindFirstArgs>(args?: SelectSubset<T, CrawlEventFindFirstArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first CrawlEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrawlEventFindFirstOrThrowArgs} args - Arguments to find a CrawlEvent
     * @example
     * // Get one CrawlEvent
     * const crawlEvent = await prisma.crawlEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CrawlEventFindFirstOrThrowArgs>(args?: SelectSubset<T, CrawlEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more CrawlEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrawlEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CrawlEvents
     * const crawlEvents = await prisma.crawlEvent.findMany()
     * 
     * // Get first 10 CrawlEvents
     * const crawlEvents = await prisma.crawlEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const crawlEventWithIdOnly = await prisma.crawlEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CrawlEventFindManyArgs>(args?: SelectSubset<T, CrawlEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a CrawlEvent.
     * @param {CrawlEventCreateArgs} args - Arguments to create a CrawlEvent.
     * @example
     * // Create one CrawlEvent
     * const CrawlEvent = await prisma.crawlEvent.create({
     *   data: {
     *     // ... data to create a CrawlEvent
     *   }
     * })
     * 
     */
    create<T extends CrawlEventCreateArgs>(args: SelectSubset<T, CrawlEventCreateArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many CrawlEvents.
     * @param {CrawlEventCreateManyArgs} args - Arguments to create many CrawlEvents.
     * @example
     * // Create many CrawlEvents
     * const crawlEvent = await prisma.crawlEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CrawlEventCreateManyArgs>(args?: SelectSubset<T, CrawlEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CrawlEvents and returns the data saved in the database.
     * @param {CrawlEventCreateManyAndReturnArgs} args - Arguments to create many CrawlEvents.
     * @example
     * // Create many CrawlEvents
     * const crawlEvent = await prisma.crawlEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CrawlEvents and only return the `id`
     * const crawlEventWithIdOnly = await prisma.crawlEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CrawlEventCreateManyAndReturnArgs>(args?: SelectSubset<T, CrawlEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a CrawlEvent.
     * @param {CrawlEventDeleteArgs} args - Arguments to delete one CrawlEvent.
     * @example
     * // Delete one CrawlEvent
     * const CrawlEvent = await prisma.crawlEvent.delete({
     *   where: {
     *     // ... filter to delete one CrawlEvent
     *   }
     * })
     * 
     */
    delete<T extends CrawlEventDeleteArgs>(args: SelectSubset<T, CrawlEventDeleteArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one CrawlEvent.
     * @param {CrawlEventUpdateArgs} args - Arguments to update one CrawlEvent.
     * @example
     * // Update one CrawlEvent
     * const crawlEvent = await prisma.crawlEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CrawlEventUpdateArgs>(args: SelectSubset<T, CrawlEventUpdateArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more CrawlEvents.
     * @param {CrawlEventDeleteManyArgs} args - Arguments to filter CrawlEvents to delete.
     * @example
     * // Delete a few CrawlEvents
     * const { count } = await prisma.crawlEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CrawlEventDeleteManyArgs>(args?: SelectSubset<T, CrawlEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrawlEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrawlEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CrawlEvents
     * const crawlEvent = await prisma.crawlEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CrawlEventUpdateManyArgs>(args: SelectSubset<T, CrawlEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrawlEvents and returns the data updated in the database.
     * @param {CrawlEventUpdateManyAndReturnArgs} args - Arguments to update many CrawlEvents.
     * @example
     * // Update many CrawlEvents
     * const crawlEvent = await prisma.crawlEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CrawlEvents and only return the `id`
     * const crawlEventWithIdOnly = await prisma.crawlEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CrawlEventUpdateManyAndReturnArgs>(args: SelectSubset<T, CrawlEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one CrawlEvent.
     * @param {CrawlEventUpsertArgs} args - Arguments to update or create a CrawlEvent.
     * @example
     * // Update or create a CrawlEvent
     * const crawlEvent = await prisma.crawlEvent.upsert({
     *   create: {
     *     // ... data to create a CrawlEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CrawlEvent we want to update
     *   }
     * })
     */
    upsert<T extends CrawlEventUpsertArgs>(args: SelectSubset<T, CrawlEventUpsertArgs<ExtArgs>>): Prisma__CrawlEventClient<$Result.GetResult<Prisma.$CrawlEventPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of CrawlEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrawlEventCountArgs} args - Arguments to filter CrawlEvents to count.
     * @example
     * // Count the number of CrawlEvents
     * const count = await prisma.crawlEvent.count({
     *   where: {
     *     // ... the filter for the CrawlEvents we want to count
     *   }
     * })
    **/
    count<T extends CrawlEventCountArgs>(
      args?: Subset<T, CrawlEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CrawlEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CrawlEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrawlEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CrawlEventAggregateArgs>(args: Subset<T, CrawlEventAggregateArgs>): Prisma.PrismaPromise<GetCrawlEventAggregateType<T>>

    /**
     * Group by CrawlEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrawlEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CrawlEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CrawlEventGroupByArgs['orderBy'] }
        : { orderBy?: CrawlEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CrawlEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrawlEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CrawlEvent model
   */
  readonly fields: CrawlEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CrawlEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CrawlEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends SourceProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SourceProfileDefaultArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CrawlEvent model
   */ 
  interface CrawlEventFieldRefs {
    readonly id: FieldRef<"CrawlEvent", 'String'>
    readonly sourceId: FieldRef<"CrawlEvent", 'String'>
    readonly startTime: FieldRef<"CrawlEvent", 'DateTime'>
    readonly endTime: FieldRef<"CrawlEvent", 'DateTime'>
    readonly status: FieldRef<"CrawlEvent", 'String'>
    readonly itemsFound: FieldRef<"CrawlEvent", 'Int'>
    readonly itemsNew: FieldRef<"CrawlEvent", 'Int'>
    readonly errors: FieldRef<"CrawlEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CrawlEvent findUnique
   */
  export type CrawlEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * Filter, which CrawlEvent to fetch.
     */
    where: CrawlEventWhereUniqueInput
  }

  /**
   * CrawlEvent findUniqueOrThrow
   */
  export type CrawlEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * Filter, which CrawlEvent to fetch.
     */
    where: CrawlEventWhereUniqueInput
  }

  /**
   * CrawlEvent findFirst
   */
  export type CrawlEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * Filter, which CrawlEvent to fetch.
     */
    where?: CrawlEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrawlEvents to fetch.
     */
    orderBy?: CrawlEventOrderByWithRelationInput | CrawlEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrawlEvents.
     */
    cursor?: CrawlEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrawlEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrawlEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrawlEvents.
     */
    distinct?: CrawlEventScalarFieldEnum | CrawlEventScalarFieldEnum[]
  }

  /**
   * CrawlEvent findFirstOrThrow
   */
  export type CrawlEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * Filter, which CrawlEvent to fetch.
     */
    where?: CrawlEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrawlEvents to fetch.
     */
    orderBy?: CrawlEventOrderByWithRelationInput | CrawlEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrawlEvents.
     */
    cursor?: CrawlEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrawlEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrawlEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrawlEvents.
     */
    distinct?: CrawlEventScalarFieldEnum | CrawlEventScalarFieldEnum[]
  }

  /**
   * CrawlEvent findMany
   */
  export type CrawlEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * Filter, which CrawlEvents to fetch.
     */
    where?: CrawlEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrawlEvents to fetch.
     */
    orderBy?: CrawlEventOrderByWithRelationInput | CrawlEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CrawlEvents.
     */
    cursor?: CrawlEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrawlEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrawlEvents.
     */
    skip?: number
    distinct?: CrawlEventScalarFieldEnum | CrawlEventScalarFieldEnum[]
  }

  /**
   * CrawlEvent create
   */
  export type CrawlEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * The data needed to create a CrawlEvent.
     */
    data: XOR<CrawlEventCreateInput, CrawlEventUncheckedCreateInput>
  }

  /**
   * CrawlEvent createMany
   */
  export type CrawlEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CrawlEvents.
     */
    data: CrawlEventCreateManyInput | CrawlEventCreateManyInput[]
  }

  /**
   * CrawlEvent createManyAndReturn
   */
  export type CrawlEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * The data used to create many CrawlEvents.
     */
    data: CrawlEventCreateManyInput | CrawlEventCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CrawlEvent update
   */
  export type CrawlEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * The data needed to update a CrawlEvent.
     */
    data: XOR<CrawlEventUpdateInput, CrawlEventUncheckedUpdateInput>
    /**
     * Choose, which CrawlEvent to update.
     */
    where: CrawlEventWhereUniqueInput
  }

  /**
   * CrawlEvent updateMany
   */
  export type CrawlEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CrawlEvents.
     */
    data: XOR<CrawlEventUpdateManyMutationInput, CrawlEventUncheckedUpdateManyInput>
    /**
     * Filter which CrawlEvents to update
     */
    where?: CrawlEventWhereInput
    /**
     * Limit how many CrawlEvents to update.
     */
    limit?: number
  }

  /**
   * CrawlEvent updateManyAndReturn
   */
  export type CrawlEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * The data used to update CrawlEvents.
     */
    data: XOR<CrawlEventUpdateManyMutationInput, CrawlEventUncheckedUpdateManyInput>
    /**
     * Filter which CrawlEvents to update
     */
    where?: CrawlEventWhereInput
    /**
     * Limit how many CrawlEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CrawlEvent upsert
   */
  export type CrawlEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * The filter to search for the CrawlEvent to update in case it exists.
     */
    where: CrawlEventWhereUniqueInput
    /**
     * In case the CrawlEvent found by the `where` argument doesn't exist, create a new CrawlEvent with this data.
     */
    create: XOR<CrawlEventCreateInput, CrawlEventUncheckedCreateInput>
    /**
     * In case the CrawlEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CrawlEventUpdateInput, CrawlEventUncheckedUpdateInput>
  }

  /**
   * CrawlEvent delete
   */
  export type CrawlEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
    /**
     * Filter which CrawlEvent to delete.
     */
    where: CrawlEventWhereUniqueInput
  }

  /**
   * CrawlEvent deleteMany
   */
  export type CrawlEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrawlEvents to delete
     */
    where?: CrawlEventWhereInput
    /**
     * Limit how many CrawlEvents to delete.
     */
    limit?: number
  }

  /**
   * CrawlEvent without action
   */
  export type CrawlEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrawlEvent
     */
    select?: CrawlEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrawlEvent
     */
    omit?: CrawlEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrawlEventInclude<ExtArgs> | null
  }


  /**
   * Model SourceSnapshot
   */

  export type AggregateSourceSnapshot = {
    _count: SourceSnapshotCountAggregateOutputType | null
    _min: SourceSnapshotMinAggregateOutputType | null
    _max: SourceSnapshotMaxAggregateOutputType | null
  }

  export type SourceSnapshotMinAggregateOutputType = {
    id: string | null
    sourceId: string | null
    externalId: string | null
    url: string | null
    fetchedAt: Date | null
    rawHtml: string | null
    rawJson: string | null
    contentHash: string | null
    imagesEnriched: boolean | null
    enrichedAt: Date | null
    enrichmentError: string | null
  }

  export type SourceSnapshotMaxAggregateOutputType = {
    id: string | null
    sourceId: string | null
    externalId: string | null
    url: string | null
    fetchedAt: Date | null
    rawHtml: string | null
    rawJson: string | null
    contentHash: string | null
    imagesEnriched: boolean | null
    enrichedAt: Date | null
    enrichmentError: string | null
  }

  export type SourceSnapshotCountAggregateOutputType = {
    id: number
    sourceId: number
    externalId: number
    url: number
    fetchedAt: number
    rawHtml: number
    rawJson: number
    contentHash: number
    imagesEnriched: number
    enrichedAt: number
    enrichmentError: number
    _all: number
  }


  export type SourceSnapshotMinAggregateInputType = {
    id?: true
    sourceId?: true
    externalId?: true
    url?: true
    fetchedAt?: true
    rawHtml?: true
    rawJson?: true
    contentHash?: true
    imagesEnriched?: true
    enrichedAt?: true
    enrichmentError?: true
  }

  export type SourceSnapshotMaxAggregateInputType = {
    id?: true
    sourceId?: true
    externalId?: true
    url?: true
    fetchedAt?: true
    rawHtml?: true
    rawJson?: true
    contentHash?: true
    imagesEnriched?: true
    enrichedAt?: true
    enrichmentError?: true
  }

  export type SourceSnapshotCountAggregateInputType = {
    id?: true
    sourceId?: true
    externalId?: true
    url?: true
    fetchedAt?: true
    rawHtml?: true
    rawJson?: true
    contentHash?: true
    imagesEnriched?: true
    enrichedAt?: true
    enrichmentError?: true
    _all?: true
  }

  export type SourceSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceSnapshot to aggregate.
     */
    where?: SourceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceSnapshots to fetch.
     */
    orderBy?: SourceSnapshotOrderByWithRelationInput | SourceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SourceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SourceSnapshots
    **/
    _count?: true | SourceSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SourceSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SourceSnapshotMaxAggregateInputType
  }

  export type GetSourceSnapshotAggregateType<T extends SourceSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateSourceSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSourceSnapshot[P]>
      : GetScalarType<T[P], AggregateSourceSnapshot[P]>
  }




  export type SourceSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceSnapshotWhereInput
    orderBy?: SourceSnapshotOrderByWithAggregationInput | SourceSnapshotOrderByWithAggregationInput[]
    by: SourceSnapshotScalarFieldEnum[] | SourceSnapshotScalarFieldEnum
    having?: SourceSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SourceSnapshotCountAggregateInputType | true
    _min?: SourceSnapshotMinAggregateInputType
    _max?: SourceSnapshotMaxAggregateInputType
  }

  export type SourceSnapshotGroupByOutputType = {
    id: string
    sourceId: string
    externalId: string
    url: string
    fetchedAt: Date
    rawHtml: string | null
    rawJson: string | null
    contentHash: string
    imagesEnriched: boolean
    enrichedAt: Date | null
    enrichmentError: string | null
    _count: SourceSnapshotCountAggregateOutputType | null
    _min: SourceSnapshotMinAggregateOutputType | null
    _max: SourceSnapshotMaxAggregateOutputType | null
  }

  type GetSourceSnapshotGroupByPayload<T extends SourceSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SourceSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SourceSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SourceSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], SourceSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type SourceSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    externalId?: boolean
    url?: boolean
    fetchedAt?: boolean
    rawHtml?: boolean
    rawJson?: boolean
    contentHash?: boolean
    imagesEnriched?: boolean
    enrichedAt?: boolean
    enrichmentError?: boolean
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
    observedListing?: boolean | SourceSnapshot$observedListingArgs<ExtArgs>
  }, ExtArgs["result"]["sourceSnapshot"]>

  export type SourceSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    externalId?: boolean
    url?: boolean
    fetchedAt?: boolean
    rawHtml?: boolean
    rawJson?: boolean
    contentHash?: boolean
    imagesEnriched?: boolean
    enrichedAt?: boolean
    enrichmentError?: boolean
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sourceSnapshot"]>

  export type SourceSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    externalId?: boolean
    url?: boolean
    fetchedAt?: boolean
    rawHtml?: boolean
    rawJson?: boolean
    contentHash?: boolean
    imagesEnriched?: boolean
    enrichedAt?: boolean
    enrichmentError?: boolean
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sourceSnapshot"]>

  export type SourceSnapshotSelectScalar = {
    id?: boolean
    sourceId?: boolean
    externalId?: boolean
    url?: boolean
    fetchedAt?: boolean
    rawHtml?: boolean
    rawJson?: boolean
    contentHash?: boolean
    imagesEnriched?: boolean
    enrichedAt?: boolean
    enrichmentError?: boolean
  }

  export type SourceSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceId" | "externalId" | "url" | "fetchedAt" | "rawHtml" | "rawJson" | "contentHash" | "imagesEnriched" | "enrichedAt" | "enrichmentError", ExtArgs["result"]["sourceSnapshot"]>
  export type SourceSnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
    observedListing?: boolean | SourceSnapshot$observedListingArgs<ExtArgs>
  }
  export type SourceSnapshotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }
  export type SourceSnapshotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceProfileDefaultArgs<ExtArgs>
  }

  export type $SourceSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SourceSnapshot"
    objects: {
      source: Prisma.$SourceProfilePayload<ExtArgs>
      observedListing: Prisma.$ObservedListingPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceId: string
      externalId: string
      url: string
      fetchedAt: Date
      rawHtml: string | null
      rawJson: string | null
      contentHash: string
      imagesEnriched: boolean
      enrichedAt: Date | null
      enrichmentError: string | null
    }, ExtArgs["result"]["sourceSnapshot"]>
    composites: {}
  }

  type SourceSnapshotGetPayload<S extends boolean | null | undefined | SourceSnapshotDefaultArgs> = $Result.GetResult<Prisma.$SourceSnapshotPayload, S>

  type SourceSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SourceSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SourceSnapshotCountAggregateInputType | true
    }

  export interface SourceSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SourceSnapshot'], meta: { name: 'SourceSnapshot' } }
    /**
     * Find zero or one SourceSnapshot that matches the filter.
     * @param {SourceSnapshotFindUniqueArgs} args - Arguments to find a SourceSnapshot
     * @example
     * // Get one SourceSnapshot
     * const sourceSnapshot = await prisma.sourceSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SourceSnapshotFindUniqueArgs>(args: SelectSubset<T, SourceSnapshotFindUniqueArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one SourceSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SourceSnapshotFindUniqueOrThrowArgs} args - Arguments to find a SourceSnapshot
     * @example
     * // Get one SourceSnapshot
     * const sourceSnapshot = await prisma.sourceSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SourceSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, SourceSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first SourceSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceSnapshotFindFirstArgs} args - Arguments to find a SourceSnapshot
     * @example
     * // Get one SourceSnapshot
     * const sourceSnapshot = await prisma.sourceSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SourceSnapshotFindFirstArgs>(args?: SelectSubset<T, SourceSnapshotFindFirstArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first SourceSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceSnapshotFindFirstOrThrowArgs} args - Arguments to find a SourceSnapshot
     * @example
     * // Get one SourceSnapshot
     * const sourceSnapshot = await prisma.sourceSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SourceSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, SourceSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more SourceSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SourceSnapshots
     * const sourceSnapshots = await prisma.sourceSnapshot.findMany()
     * 
     * // Get first 10 SourceSnapshots
     * const sourceSnapshots = await prisma.sourceSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sourceSnapshotWithIdOnly = await prisma.sourceSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SourceSnapshotFindManyArgs>(args?: SelectSubset<T, SourceSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a SourceSnapshot.
     * @param {SourceSnapshotCreateArgs} args - Arguments to create a SourceSnapshot.
     * @example
     * // Create one SourceSnapshot
     * const SourceSnapshot = await prisma.sourceSnapshot.create({
     *   data: {
     *     // ... data to create a SourceSnapshot
     *   }
     * })
     * 
     */
    create<T extends SourceSnapshotCreateArgs>(args: SelectSubset<T, SourceSnapshotCreateArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many SourceSnapshots.
     * @param {SourceSnapshotCreateManyArgs} args - Arguments to create many SourceSnapshots.
     * @example
     * // Create many SourceSnapshots
     * const sourceSnapshot = await prisma.sourceSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SourceSnapshotCreateManyArgs>(args?: SelectSubset<T, SourceSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SourceSnapshots and returns the data saved in the database.
     * @param {SourceSnapshotCreateManyAndReturnArgs} args - Arguments to create many SourceSnapshots.
     * @example
     * // Create many SourceSnapshots
     * const sourceSnapshot = await prisma.sourceSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SourceSnapshots and only return the `id`
     * const sourceSnapshotWithIdOnly = await prisma.sourceSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SourceSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, SourceSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a SourceSnapshot.
     * @param {SourceSnapshotDeleteArgs} args - Arguments to delete one SourceSnapshot.
     * @example
     * // Delete one SourceSnapshot
     * const SourceSnapshot = await prisma.sourceSnapshot.delete({
     *   where: {
     *     // ... filter to delete one SourceSnapshot
     *   }
     * })
     * 
     */
    delete<T extends SourceSnapshotDeleteArgs>(args: SelectSubset<T, SourceSnapshotDeleteArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one SourceSnapshot.
     * @param {SourceSnapshotUpdateArgs} args - Arguments to update one SourceSnapshot.
     * @example
     * // Update one SourceSnapshot
     * const sourceSnapshot = await prisma.sourceSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SourceSnapshotUpdateArgs>(args: SelectSubset<T, SourceSnapshotUpdateArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more SourceSnapshots.
     * @param {SourceSnapshotDeleteManyArgs} args - Arguments to filter SourceSnapshots to delete.
     * @example
     * // Delete a few SourceSnapshots
     * const { count } = await prisma.sourceSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SourceSnapshotDeleteManyArgs>(args?: SelectSubset<T, SourceSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SourceSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SourceSnapshots
     * const sourceSnapshot = await prisma.sourceSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SourceSnapshotUpdateManyArgs>(args: SelectSubset<T, SourceSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SourceSnapshots and returns the data updated in the database.
     * @param {SourceSnapshotUpdateManyAndReturnArgs} args - Arguments to update many SourceSnapshots.
     * @example
     * // Update many SourceSnapshots
     * const sourceSnapshot = await prisma.sourceSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SourceSnapshots and only return the `id`
     * const sourceSnapshotWithIdOnly = await prisma.sourceSnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SourceSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, SourceSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one SourceSnapshot.
     * @param {SourceSnapshotUpsertArgs} args - Arguments to update or create a SourceSnapshot.
     * @example
     * // Update or create a SourceSnapshot
     * const sourceSnapshot = await prisma.sourceSnapshot.upsert({
     *   create: {
     *     // ... data to create a SourceSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SourceSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends SourceSnapshotUpsertArgs>(args: SelectSubset<T, SourceSnapshotUpsertArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of SourceSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceSnapshotCountArgs} args - Arguments to filter SourceSnapshots to count.
     * @example
     * // Count the number of SourceSnapshots
     * const count = await prisma.sourceSnapshot.count({
     *   where: {
     *     // ... the filter for the SourceSnapshots we want to count
     *   }
     * })
    **/
    count<T extends SourceSnapshotCountArgs>(
      args?: Subset<T, SourceSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SourceSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SourceSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SourceSnapshotAggregateArgs>(args: Subset<T, SourceSnapshotAggregateArgs>): Prisma.PrismaPromise<GetSourceSnapshotAggregateType<T>>

    /**
     * Group by SourceSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SourceSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SourceSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: SourceSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SourceSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSourceSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SourceSnapshot model
   */
  readonly fields: SourceSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SourceSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SourceSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends SourceProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SourceProfileDefaultArgs<ExtArgs>>): Prisma__SourceProfileClient<$Result.GetResult<Prisma.$SourceProfilePayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
    observedListing<T extends SourceSnapshot$observedListingArgs<ExtArgs> = {}>(args?: Subset<T, SourceSnapshot$observedListingArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | null, null, ExtArgs, ClientOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SourceSnapshot model
   */ 
  interface SourceSnapshotFieldRefs {
    readonly id: FieldRef<"SourceSnapshot", 'String'>
    readonly sourceId: FieldRef<"SourceSnapshot", 'String'>
    readonly externalId: FieldRef<"SourceSnapshot", 'String'>
    readonly url: FieldRef<"SourceSnapshot", 'String'>
    readonly fetchedAt: FieldRef<"SourceSnapshot", 'DateTime'>
    readonly rawHtml: FieldRef<"SourceSnapshot", 'String'>
    readonly rawJson: FieldRef<"SourceSnapshot", 'String'>
    readonly contentHash: FieldRef<"SourceSnapshot", 'String'>
    readonly imagesEnriched: FieldRef<"SourceSnapshot", 'Boolean'>
    readonly enrichedAt: FieldRef<"SourceSnapshot", 'DateTime'>
    readonly enrichmentError: FieldRef<"SourceSnapshot", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SourceSnapshot findUnique
   */
  export type SourceSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SourceSnapshot to fetch.
     */
    where: SourceSnapshotWhereUniqueInput
  }

  /**
   * SourceSnapshot findUniqueOrThrow
   */
  export type SourceSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SourceSnapshot to fetch.
     */
    where: SourceSnapshotWhereUniqueInput
  }

  /**
   * SourceSnapshot findFirst
   */
  export type SourceSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SourceSnapshot to fetch.
     */
    where?: SourceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceSnapshots to fetch.
     */
    orderBy?: SourceSnapshotOrderByWithRelationInput | SourceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceSnapshots.
     */
    cursor?: SourceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceSnapshots.
     */
    distinct?: SourceSnapshotScalarFieldEnum | SourceSnapshotScalarFieldEnum[]
  }

  /**
   * SourceSnapshot findFirstOrThrow
   */
  export type SourceSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SourceSnapshot to fetch.
     */
    where?: SourceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceSnapshots to fetch.
     */
    orderBy?: SourceSnapshotOrderByWithRelationInput | SourceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceSnapshots.
     */
    cursor?: SourceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceSnapshots.
     */
    distinct?: SourceSnapshotScalarFieldEnum | SourceSnapshotScalarFieldEnum[]
  }

  /**
   * SourceSnapshot findMany
   */
  export type SourceSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SourceSnapshots to fetch.
     */
    where?: SourceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceSnapshots to fetch.
     */
    orderBy?: SourceSnapshotOrderByWithRelationInput | SourceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SourceSnapshots.
     */
    cursor?: SourceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceSnapshots.
     */
    skip?: number
    distinct?: SourceSnapshotScalarFieldEnum | SourceSnapshotScalarFieldEnum[]
  }

  /**
   * SourceSnapshot create
   */
  export type SourceSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a SourceSnapshot.
     */
    data: XOR<SourceSnapshotCreateInput, SourceSnapshotUncheckedCreateInput>
  }

  /**
   * SourceSnapshot createMany
   */
  export type SourceSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SourceSnapshots.
     */
    data: SourceSnapshotCreateManyInput | SourceSnapshotCreateManyInput[]
  }

  /**
   * SourceSnapshot createManyAndReturn
   */
  export type SourceSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many SourceSnapshots.
     */
    data: SourceSnapshotCreateManyInput | SourceSnapshotCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SourceSnapshot update
   */
  export type SourceSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a SourceSnapshot.
     */
    data: XOR<SourceSnapshotUpdateInput, SourceSnapshotUncheckedUpdateInput>
    /**
     * Choose, which SourceSnapshot to update.
     */
    where: SourceSnapshotWhereUniqueInput
  }

  /**
   * SourceSnapshot updateMany
   */
  export type SourceSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SourceSnapshots.
     */
    data: XOR<SourceSnapshotUpdateManyMutationInput, SourceSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which SourceSnapshots to update
     */
    where?: SourceSnapshotWhereInput
    /**
     * Limit how many SourceSnapshots to update.
     */
    limit?: number
  }

  /**
   * SourceSnapshot updateManyAndReturn
   */
  export type SourceSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update SourceSnapshots.
     */
    data: XOR<SourceSnapshotUpdateManyMutationInput, SourceSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which SourceSnapshots to update
     */
    where?: SourceSnapshotWhereInput
    /**
     * Limit how many SourceSnapshots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SourceSnapshot upsert
   */
  export type SourceSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the SourceSnapshot to update in case it exists.
     */
    where: SourceSnapshotWhereUniqueInput
    /**
     * In case the SourceSnapshot found by the `where` argument doesn't exist, create a new SourceSnapshot with this data.
     */
    create: XOR<SourceSnapshotCreateInput, SourceSnapshotUncheckedCreateInput>
    /**
     * In case the SourceSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SourceSnapshotUpdateInput, SourceSnapshotUncheckedUpdateInput>
  }

  /**
   * SourceSnapshot delete
   */
  export type SourceSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
    /**
     * Filter which SourceSnapshot to delete.
     */
    where: SourceSnapshotWhereUniqueInput
  }

  /**
   * SourceSnapshot deleteMany
   */
  export type SourceSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceSnapshots to delete
     */
    where?: SourceSnapshotWhereInput
    /**
     * Limit how many SourceSnapshots to delete.
     */
    limit?: number
  }

  /**
   * SourceSnapshot.observedListing
   */
  export type SourceSnapshot$observedListingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    where?: ObservedListingWhereInput
  }

  /**
   * SourceSnapshot without action
   */
  export type SourceSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceSnapshot
     */
    select?: SourceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceSnapshot
     */
    omit?: SourceSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceSnapshotInclude<ExtArgs> | null
  }


  /**
   * Model ObservedListing
   */

  export type AggregateObservedListing = {
    _count: ObservedListingCountAggregateOutputType | null
    _avg: ObservedListingAvgAggregateOutputType | null
    _sum: ObservedListingSumAggregateOutputType | null
    _min: ObservedListingMinAggregateOutputType | null
    _max: ObservedListingMaxAggregateOutputType | null
  }

  export type ObservedListingAvgAggregateOutputType = {
    price: number | null
    lat: number | null
    lng: number | null
    confidenceScore: number | null
  }

  export type ObservedListingSumAggregateOutputType = {
    price: number | null
    lat: number | null
    lng: number | null
    confidenceScore: number | null
  }

  export type ObservedListingMinAggregateOutputType = {
    id: string | null
    snapshotId: string | null
    title: string | null
    description: string | null
    price: number | null
    currency: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    lat: number | null
    lng: number | null
    status: string | null
    listedAt: Date | null
    geoHash: string | null
    addressHash: string | null
    mediaHash: string | null
    confidenceScore: number | null
    createdAt: Date | null
  }

  export type ObservedListingMaxAggregateOutputType = {
    id: string | null
    snapshotId: string | null
    title: string | null
    description: string | null
    price: number | null
    currency: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    lat: number | null
    lng: number | null
    status: string | null
    listedAt: Date | null
    geoHash: string | null
    addressHash: string | null
    mediaHash: string | null
    confidenceScore: number | null
    createdAt: Date | null
  }

  export type ObservedListingCountAggregateOutputType = {
    id: number
    snapshotId: number
    title: number
    description: number
    price: number
    currency: number
    address: number
    city: number
    state: number
    zipCode: number
    lat: number
    lng: number
    status: number
    listedAt: number
    geoHash: number
    addressHash: number
    mediaHash: number
    confidenceScore: number
    createdAt: number
    _all: number
  }


  export type ObservedListingAvgAggregateInputType = {
    price?: true
    lat?: true
    lng?: true
    confidenceScore?: true
  }

  export type ObservedListingSumAggregateInputType = {
    price?: true
    lat?: true
    lng?: true
    confidenceScore?: true
  }

  export type ObservedListingMinAggregateInputType = {
    id?: true
    snapshotId?: true
    title?: true
    description?: true
    price?: true
    currency?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    lat?: true
    lng?: true
    status?: true
    listedAt?: true
    geoHash?: true
    addressHash?: true
    mediaHash?: true
    confidenceScore?: true
    createdAt?: true
  }

  export type ObservedListingMaxAggregateInputType = {
    id?: true
    snapshotId?: true
    title?: true
    description?: true
    price?: true
    currency?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    lat?: true
    lng?: true
    status?: true
    listedAt?: true
    geoHash?: true
    addressHash?: true
    mediaHash?: true
    confidenceScore?: true
    createdAt?: true
  }

  export type ObservedListingCountAggregateInputType = {
    id?: true
    snapshotId?: true
    title?: true
    description?: true
    price?: true
    currency?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    lat?: true
    lng?: true
    status?: true
    listedAt?: true
    geoHash?: true
    addressHash?: true
    mediaHash?: true
    confidenceScore?: true
    createdAt?: true
    _all?: true
  }

  export type ObservedListingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObservedListing to aggregate.
     */
    where?: ObservedListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObservedListings to fetch.
     */
    orderBy?: ObservedListingOrderByWithRelationInput | ObservedListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObservedListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObservedListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObservedListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ObservedListings
    **/
    _count?: true | ObservedListingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ObservedListingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ObservedListingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObservedListingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObservedListingMaxAggregateInputType
  }

  export type GetObservedListingAggregateType<T extends ObservedListingAggregateArgs> = {
        [P in keyof T & keyof AggregateObservedListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObservedListing[P]>
      : GetScalarType<T[P], AggregateObservedListing[P]>
  }




  export type ObservedListingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObservedListingWhereInput
    orderBy?: ObservedListingOrderByWithAggregationInput | ObservedListingOrderByWithAggregationInput[]
    by: ObservedListingScalarFieldEnum[] | ObservedListingScalarFieldEnum
    having?: ObservedListingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObservedListingCountAggregateInputType | true
    _avg?: ObservedListingAvgAggregateInputType
    _sum?: ObservedListingSumAggregateInputType
    _min?: ObservedListingMinAggregateInputType
    _max?: ObservedListingMaxAggregateInputType
  }

  export type ObservedListingGroupByOutputType = {
    id: string
    snapshotId: string
    title: string | null
    description: string | null
    price: number | null
    currency: string
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    lat: number | null
    lng: number | null
    status: string | null
    listedAt: Date | null
    geoHash: string | null
    addressHash: string | null
    mediaHash: string | null
    confidenceScore: number
    createdAt: Date
    _count: ObservedListingCountAggregateOutputType | null
    _avg: ObservedListingAvgAggregateOutputType | null
    _sum: ObservedListingSumAggregateOutputType | null
    _min: ObservedListingMinAggregateOutputType | null
    _max: ObservedListingMaxAggregateOutputType | null
  }

  type GetObservedListingGroupByPayload<T extends ObservedListingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObservedListingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObservedListingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObservedListingGroupByOutputType[P]>
            : GetScalarType<T[P], ObservedListingGroupByOutputType[P]>
        }
      >
    >


  export type ObservedListingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    currency?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    lat?: boolean
    lng?: boolean
    status?: boolean
    listedAt?: boolean
    geoHash?: boolean
    addressHash?: boolean
    mediaHash?: boolean
    confidenceScore?: boolean
    createdAt?: boolean
    snapshot?: boolean | SourceSnapshotDefaultArgs<ExtArgs>
    signals?: boolean | ObservedListing$signalsArgs<ExtArgs>
    _count?: boolean | ObservedListingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["observedListing"]>

  export type ObservedListingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    currency?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    lat?: boolean
    lng?: boolean
    status?: boolean
    listedAt?: boolean
    geoHash?: boolean
    addressHash?: boolean
    mediaHash?: boolean
    confidenceScore?: boolean
    createdAt?: boolean
    snapshot?: boolean | SourceSnapshotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["observedListing"]>

  export type ObservedListingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    currency?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    lat?: boolean
    lng?: boolean
    status?: boolean
    listedAt?: boolean
    geoHash?: boolean
    addressHash?: boolean
    mediaHash?: boolean
    confidenceScore?: boolean
    createdAt?: boolean
    snapshot?: boolean | SourceSnapshotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["observedListing"]>

  export type ObservedListingSelectScalar = {
    id?: boolean
    snapshotId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    currency?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    lat?: boolean
    lng?: boolean
    status?: boolean
    listedAt?: boolean
    geoHash?: boolean
    addressHash?: boolean
    mediaHash?: boolean
    confidenceScore?: boolean
    createdAt?: boolean
  }

  export type ObservedListingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotId" | "title" | "description" | "price" | "currency" | "address" | "city" | "state" | "zipCode" | "lat" | "lng" | "status" | "listedAt" | "geoHash" | "addressHash" | "mediaHash" | "confidenceScore" | "createdAt", ExtArgs["result"]["observedListing"]>
  export type ObservedListingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshot?: boolean | SourceSnapshotDefaultArgs<ExtArgs>
    signals?: boolean | ObservedListing$signalsArgs<ExtArgs>
    _count?: boolean | ObservedListingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ObservedListingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshot?: boolean | SourceSnapshotDefaultArgs<ExtArgs>
  }
  export type ObservedListingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshot?: boolean | SourceSnapshotDefaultArgs<ExtArgs>
  }

  export type $ObservedListingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ObservedListing"
    objects: {
      snapshot: Prisma.$SourceSnapshotPayload<ExtArgs>
      signals: Prisma.$SignalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      snapshotId: string
      title: string | null
      description: string | null
      price: number | null
      currency: string
      address: string | null
      city: string | null
      state: string | null
      zipCode: string | null
      lat: number | null
      lng: number | null
      status: string | null
      listedAt: Date | null
      geoHash: string | null
      addressHash: string | null
      mediaHash: string | null
      confidenceScore: number
      createdAt: Date
    }, ExtArgs["result"]["observedListing"]>
    composites: {}
  }

  type ObservedListingGetPayload<S extends boolean | null | undefined | ObservedListingDefaultArgs> = $Result.GetResult<Prisma.$ObservedListingPayload, S>

  type ObservedListingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ObservedListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ObservedListingCountAggregateInputType | true
    }

  export interface ObservedListingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ObservedListing'], meta: { name: 'ObservedListing' } }
    /**
     * Find zero or one ObservedListing that matches the filter.
     * @param {ObservedListingFindUniqueArgs} args - Arguments to find a ObservedListing
     * @example
     * // Get one ObservedListing
     * const observedListing = await prisma.observedListing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObservedListingFindUniqueArgs>(args: SelectSubset<T, ObservedListingFindUniqueArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one ObservedListing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ObservedListingFindUniqueOrThrowArgs} args - Arguments to find a ObservedListing
     * @example
     * // Get one ObservedListing
     * const observedListing = await prisma.observedListing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObservedListingFindUniqueOrThrowArgs>(args: SelectSubset<T, ObservedListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first ObservedListing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservedListingFindFirstArgs} args - Arguments to find a ObservedListing
     * @example
     * // Get one ObservedListing
     * const observedListing = await prisma.observedListing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObservedListingFindFirstArgs>(args?: SelectSubset<T, ObservedListingFindFirstArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first ObservedListing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservedListingFindFirstOrThrowArgs} args - Arguments to find a ObservedListing
     * @example
     * // Get one ObservedListing
     * const observedListing = await prisma.observedListing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObservedListingFindFirstOrThrowArgs>(args?: SelectSubset<T, ObservedListingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more ObservedListings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservedListingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ObservedListings
     * const observedListings = await prisma.observedListing.findMany()
     * 
     * // Get first 10 ObservedListings
     * const observedListings = await prisma.observedListing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const observedListingWithIdOnly = await prisma.observedListing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ObservedListingFindManyArgs>(args?: SelectSubset<T, ObservedListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a ObservedListing.
     * @param {ObservedListingCreateArgs} args - Arguments to create a ObservedListing.
     * @example
     * // Create one ObservedListing
     * const ObservedListing = await prisma.observedListing.create({
     *   data: {
     *     // ... data to create a ObservedListing
     *   }
     * })
     * 
     */
    create<T extends ObservedListingCreateArgs>(args: SelectSubset<T, ObservedListingCreateArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many ObservedListings.
     * @param {ObservedListingCreateManyArgs} args - Arguments to create many ObservedListings.
     * @example
     * // Create many ObservedListings
     * const observedListing = await prisma.observedListing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObservedListingCreateManyArgs>(args?: SelectSubset<T, ObservedListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ObservedListings and returns the data saved in the database.
     * @param {ObservedListingCreateManyAndReturnArgs} args - Arguments to create many ObservedListings.
     * @example
     * // Create many ObservedListings
     * const observedListing = await prisma.observedListing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ObservedListings and only return the `id`
     * const observedListingWithIdOnly = await prisma.observedListing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObservedListingCreateManyAndReturnArgs>(args?: SelectSubset<T, ObservedListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a ObservedListing.
     * @param {ObservedListingDeleteArgs} args - Arguments to delete one ObservedListing.
     * @example
     * // Delete one ObservedListing
     * const ObservedListing = await prisma.observedListing.delete({
     *   where: {
     *     // ... filter to delete one ObservedListing
     *   }
     * })
     * 
     */
    delete<T extends ObservedListingDeleteArgs>(args: SelectSubset<T, ObservedListingDeleteArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one ObservedListing.
     * @param {ObservedListingUpdateArgs} args - Arguments to update one ObservedListing.
     * @example
     * // Update one ObservedListing
     * const observedListing = await prisma.observedListing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObservedListingUpdateArgs>(args: SelectSubset<T, ObservedListingUpdateArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more ObservedListings.
     * @param {ObservedListingDeleteManyArgs} args - Arguments to filter ObservedListings to delete.
     * @example
     * // Delete a few ObservedListings
     * const { count } = await prisma.observedListing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObservedListingDeleteManyArgs>(args?: SelectSubset<T, ObservedListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObservedListings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservedListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ObservedListings
     * const observedListing = await prisma.observedListing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObservedListingUpdateManyArgs>(args: SelectSubset<T, ObservedListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObservedListings and returns the data updated in the database.
     * @param {ObservedListingUpdateManyAndReturnArgs} args - Arguments to update many ObservedListings.
     * @example
     * // Update many ObservedListings
     * const observedListing = await prisma.observedListing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ObservedListings and only return the `id`
     * const observedListingWithIdOnly = await prisma.observedListing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ObservedListingUpdateManyAndReturnArgs>(args: SelectSubset<T, ObservedListingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one ObservedListing.
     * @param {ObservedListingUpsertArgs} args - Arguments to update or create a ObservedListing.
     * @example
     * // Update or create a ObservedListing
     * const observedListing = await prisma.observedListing.upsert({
     *   create: {
     *     // ... data to create a ObservedListing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ObservedListing we want to update
     *   }
     * })
     */
    upsert<T extends ObservedListingUpsertArgs>(args: SelectSubset<T, ObservedListingUpsertArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of ObservedListings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservedListingCountArgs} args - Arguments to filter ObservedListings to count.
     * @example
     * // Count the number of ObservedListings
     * const count = await prisma.observedListing.count({
     *   where: {
     *     // ... the filter for the ObservedListings we want to count
     *   }
     * })
    **/
    count<T extends ObservedListingCountArgs>(
      args?: Subset<T, ObservedListingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObservedListingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ObservedListing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservedListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObservedListingAggregateArgs>(args: Subset<T, ObservedListingAggregateArgs>): Prisma.PrismaPromise<GetObservedListingAggregateType<T>>

    /**
     * Group by ObservedListing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservedListingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObservedListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObservedListingGroupByArgs['orderBy'] }
        : { orderBy?: ObservedListingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObservedListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObservedListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ObservedListing model
   */
  readonly fields: ObservedListingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ObservedListing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObservedListingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    snapshot<T extends SourceSnapshotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SourceSnapshotDefaultArgs<ExtArgs>>): Prisma__SourceSnapshotClient<$Result.GetResult<Prisma.$SourceSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
    signals<T extends ObservedListing$signalsArgs<ExtArgs> = {}>(args?: Subset<T, ObservedListing$signalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "findMany", ClientOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ObservedListing model
   */ 
  interface ObservedListingFieldRefs {
    readonly id: FieldRef<"ObservedListing", 'String'>
    readonly snapshotId: FieldRef<"ObservedListing", 'String'>
    readonly title: FieldRef<"ObservedListing", 'String'>
    readonly description: FieldRef<"ObservedListing", 'String'>
    readonly price: FieldRef<"ObservedListing", 'Float'>
    readonly currency: FieldRef<"ObservedListing", 'String'>
    readonly address: FieldRef<"ObservedListing", 'String'>
    readonly city: FieldRef<"ObservedListing", 'String'>
    readonly state: FieldRef<"ObservedListing", 'String'>
    readonly zipCode: FieldRef<"ObservedListing", 'String'>
    readonly lat: FieldRef<"ObservedListing", 'Float'>
    readonly lng: FieldRef<"ObservedListing", 'Float'>
    readonly status: FieldRef<"ObservedListing", 'String'>
    readonly listedAt: FieldRef<"ObservedListing", 'DateTime'>
    readonly geoHash: FieldRef<"ObservedListing", 'String'>
    readonly addressHash: FieldRef<"ObservedListing", 'String'>
    readonly mediaHash: FieldRef<"ObservedListing", 'String'>
    readonly confidenceScore: FieldRef<"ObservedListing", 'Float'>
    readonly createdAt: FieldRef<"ObservedListing", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ObservedListing findUnique
   */
  export type ObservedListingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * Filter, which ObservedListing to fetch.
     */
    where: ObservedListingWhereUniqueInput
  }

  /**
   * ObservedListing findUniqueOrThrow
   */
  export type ObservedListingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * Filter, which ObservedListing to fetch.
     */
    where: ObservedListingWhereUniqueInput
  }

  /**
   * ObservedListing findFirst
   */
  export type ObservedListingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * Filter, which ObservedListing to fetch.
     */
    where?: ObservedListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObservedListings to fetch.
     */
    orderBy?: ObservedListingOrderByWithRelationInput | ObservedListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObservedListings.
     */
    cursor?: ObservedListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObservedListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObservedListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObservedListings.
     */
    distinct?: ObservedListingScalarFieldEnum | ObservedListingScalarFieldEnum[]
  }

  /**
   * ObservedListing findFirstOrThrow
   */
  export type ObservedListingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * Filter, which ObservedListing to fetch.
     */
    where?: ObservedListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObservedListings to fetch.
     */
    orderBy?: ObservedListingOrderByWithRelationInput | ObservedListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObservedListings.
     */
    cursor?: ObservedListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObservedListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObservedListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObservedListings.
     */
    distinct?: ObservedListingScalarFieldEnum | ObservedListingScalarFieldEnum[]
  }

  /**
   * ObservedListing findMany
   */
  export type ObservedListingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * Filter, which ObservedListings to fetch.
     */
    where?: ObservedListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObservedListings to fetch.
     */
    orderBy?: ObservedListingOrderByWithRelationInput | ObservedListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ObservedListings.
     */
    cursor?: ObservedListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObservedListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObservedListings.
     */
    skip?: number
    distinct?: ObservedListingScalarFieldEnum | ObservedListingScalarFieldEnum[]
  }

  /**
   * ObservedListing create
   */
  export type ObservedListingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * The data needed to create a ObservedListing.
     */
    data: XOR<ObservedListingCreateInput, ObservedListingUncheckedCreateInput>
  }

  /**
   * ObservedListing createMany
   */
  export type ObservedListingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ObservedListings.
     */
    data: ObservedListingCreateManyInput | ObservedListingCreateManyInput[]
  }

  /**
   * ObservedListing createManyAndReturn
   */
  export type ObservedListingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * The data used to create many ObservedListings.
     */
    data: ObservedListingCreateManyInput | ObservedListingCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ObservedListing update
   */
  export type ObservedListingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * The data needed to update a ObservedListing.
     */
    data: XOR<ObservedListingUpdateInput, ObservedListingUncheckedUpdateInput>
    /**
     * Choose, which ObservedListing to update.
     */
    where: ObservedListingWhereUniqueInput
  }

  /**
   * ObservedListing updateMany
   */
  export type ObservedListingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ObservedListings.
     */
    data: XOR<ObservedListingUpdateManyMutationInput, ObservedListingUncheckedUpdateManyInput>
    /**
     * Filter which ObservedListings to update
     */
    where?: ObservedListingWhereInput
    /**
     * Limit how many ObservedListings to update.
     */
    limit?: number
  }

  /**
   * ObservedListing updateManyAndReturn
   */
  export type ObservedListingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * The data used to update ObservedListings.
     */
    data: XOR<ObservedListingUpdateManyMutationInput, ObservedListingUncheckedUpdateManyInput>
    /**
     * Filter which ObservedListings to update
     */
    where?: ObservedListingWhereInput
    /**
     * Limit how many ObservedListings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ObservedListing upsert
   */
  export type ObservedListingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * The filter to search for the ObservedListing to update in case it exists.
     */
    where: ObservedListingWhereUniqueInput
    /**
     * In case the ObservedListing found by the `where` argument doesn't exist, create a new ObservedListing with this data.
     */
    create: XOR<ObservedListingCreateInput, ObservedListingUncheckedCreateInput>
    /**
     * In case the ObservedListing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObservedListingUpdateInput, ObservedListingUncheckedUpdateInput>
  }

  /**
   * ObservedListing delete
   */
  export type ObservedListingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
    /**
     * Filter which ObservedListing to delete.
     */
    where: ObservedListingWhereUniqueInput
  }

  /**
   * ObservedListing deleteMany
   */
  export type ObservedListingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObservedListings to delete
     */
    where?: ObservedListingWhereInput
    /**
     * Limit how many ObservedListings to delete.
     */
    limit?: number
  }

  /**
   * ObservedListing.signals
   */
  export type ObservedListing$signalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    where?: SignalWhereInput
    orderBy?: SignalOrderByWithRelationInput | SignalOrderByWithRelationInput[]
    cursor?: SignalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SignalScalarFieldEnum | SignalScalarFieldEnum[]
  }

  /**
   * ObservedListing without action
   */
  export type ObservedListingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObservedListing
     */
    select?: ObservedListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObservedListing
     */
    omit?: ObservedListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservedListingInclude<ExtArgs> | null
  }


  /**
   * Model Signal
   */

  export type AggregateSignal = {
    _count: SignalCountAggregateOutputType | null
    _min: SignalMinAggregateOutputType | null
    _max: SignalMaxAggregateOutputType | null
  }

  export type SignalMinAggregateOutputType = {
    id: string | null
    type: string | null
    severity: string | null
    observedListingId: string | null
    matchedListingId: string | null
    payload: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignalMaxAggregateOutputType = {
    id: string | null
    type: string | null
    severity: string | null
    observedListingId: string | null
    matchedListingId: string | null
    payload: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignalCountAggregateOutputType = {
    id: number
    type: number
    severity: number
    observedListingId: number
    matchedListingId: number
    payload: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SignalMinAggregateInputType = {
    id?: true
    type?: true
    severity?: true
    observedListingId?: true
    matchedListingId?: true
    payload?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignalMaxAggregateInputType = {
    id?: true
    type?: true
    severity?: true
    observedListingId?: true
    matchedListingId?: true
    payload?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignalCountAggregateInputType = {
    id?: true
    type?: true
    severity?: true
    observedListingId?: true
    matchedListingId?: true
    payload?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SignalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Signal to aggregate.
     */
    where?: SignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signals to fetch.
     */
    orderBy?: SignalOrderByWithRelationInput | SignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Signals
    **/
    _count?: true | SignalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SignalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SignalMaxAggregateInputType
  }

  export type GetSignalAggregateType<T extends SignalAggregateArgs> = {
        [P in keyof T & keyof AggregateSignal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSignal[P]>
      : GetScalarType<T[P], AggregateSignal[P]>
  }




  export type SignalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignalWhereInput
    orderBy?: SignalOrderByWithAggregationInput | SignalOrderByWithAggregationInput[]
    by: SignalScalarFieldEnum[] | SignalScalarFieldEnum
    having?: SignalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SignalCountAggregateInputType | true
    _min?: SignalMinAggregateInputType
    _max?: SignalMaxAggregateInputType
  }

  export type SignalGroupByOutputType = {
    id: string
    type: string
    severity: string
    observedListingId: string
    matchedListingId: string | null
    payload: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: SignalCountAggregateOutputType | null
    _min: SignalMinAggregateOutputType | null
    _max: SignalMaxAggregateOutputType | null
  }

  type GetSignalGroupByPayload<T extends SignalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SignalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SignalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SignalGroupByOutputType[P]>
            : GetScalarType<T[P], SignalGroupByOutputType[P]>
        }
      >
    >


  export type SignalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    severity?: boolean
    observedListingId?: boolean
    matchedListingId?: boolean
    payload?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    observedListing?: boolean | ObservedListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signal"]>

  export type SignalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    severity?: boolean
    observedListingId?: boolean
    matchedListingId?: boolean
    payload?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    observedListing?: boolean | ObservedListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signal"]>

  export type SignalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    severity?: boolean
    observedListingId?: boolean
    matchedListingId?: boolean
    payload?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    observedListing?: boolean | ObservedListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signal"]>

  export type SignalSelectScalar = {
    id?: boolean
    type?: boolean
    severity?: boolean
    observedListingId?: boolean
    matchedListingId?: boolean
    payload?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SignalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "severity" | "observedListingId" | "matchedListingId" | "payload" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["signal"]>
  export type SignalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    observedListing?: boolean | ObservedListingDefaultArgs<ExtArgs>
  }
  export type SignalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    observedListing?: boolean | ObservedListingDefaultArgs<ExtArgs>
  }
  export type SignalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    observedListing?: boolean | ObservedListingDefaultArgs<ExtArgs>
  }

  export type $SignalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Signal"
    objects: {
      observedListing: Prisma.$ObservedListingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      severity: string
      observedListingId: string
      matchedListingId: string | null
      payload: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["signal"]>
    composites: {}
  }

  type SignalGetPayload<S extends boolean | null | undefined | SignalDefaultArgs> = $Result.GetResult<Prisma.$SignalPayload, S>

  type SignalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SignalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SignalCountAggregateInputType | true
    }

  export interface SignalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Signal'], meta: { name: 'Signal' } }
    /**
     * Find zero or one Signal that matches the filter.
     * @param {SignalFindUniqueArgs} args - Arguments to find a Signal
     * @example
     * // Get one Signal
     * const signal = await prisma.signal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SignalFindUniqueArgs>(args: SelectSubset<T, SignalFindUniqueArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "findUnique", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find one Signal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SignalFindUniqueOrThrowArgs} args - Arguments to find a Signal
     * @example
     * // Get one Signal
     * const signal = await prisma.signal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SignalFindUniqueOrThrowArgs>(args: SelectSubset<T, SignalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find the first Signal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalFindFirstArgs} args - Arguments to find a Signal
     * @example
     * // Get one Signal
     * const signal = await prisma.signal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SignalFindFirstArgs>(args?: SelectSubset<T, SignalFindFirstArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "findFirst", ClientOptions> | null, null, ExtArgs, ClientOptions>

    /**
     * Find the first Signal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalFindFirstOrThrowArgs} args - Arguments to find a Signal
     * @example
     * // Get one Signal
     * const signal = await prisma.signal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SignalFindFirstOrThrowArgs>(args?: SelectSubset<T, SignalFindFirstOrThrowArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "findFirstOrThrow", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Find zero or more Signals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Signals
     * const signals = await prisma.signal.findMany()
     * 
     * // Get first 10 Signals
     * const signals = await prisma.signal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const signalWithIdOnly = await prisma.signal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SignalFindManyArgs>(args?: SelectSubset<T, SignalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "findMany", ClientOptions>>

    /**
     * Create a Signal.
     * @param {SignalCreateArgs} args - Arguments to create a Signal.
     * @example
     * // Create one Signal
     * const Signal = await prisma.signal.create({
     *   data: {
     *     // ... data to create a Signal
     *   }
     * })
     * 
     */
    create<T extends SignalCreateArgs>(args: SelectSubset<T, SignalCreateArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "create", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Create many Signals.
     * @param {SignalCreateManyArgs} args - Arguments to create many Signals.
     * @example
     * // Create many Signals
     * const signal = await prisma.signal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SignalCreateManyArgs>(args?: SelectSubset<T, SignalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Signals and returns the data saved in the database.
     * @param {SignalCreateManyAndReturnArgs} args - Arguments to create many Signals.
     * @example
     * // Create many Signals
     * const signal = await prisma.signal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Signals and only return the `id`
     * const signalWithIdOnly = await prisma.signal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SignalCreateManyAndReturnArgs>(args?: SelectSubset<T, SignalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "createManyAndReturn", ClientOptions>>

    /**
     * Delete a Signal.
     * @param {SignalDeleteArgs} args - Arguments to delete one Signal.
     * @example
     * // Delete one Signal
     * const Signal = await prisma.signal.delete({
     *   where: {
     *     // ... filter to delete one Signal
     *   }
     * })
     * 
     */
    delete<T extends SignalDeleteArgs>(args: SelectSubset<T, SignalDeleteArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "delete", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Update one Signal.
     * @param {SignalUpdateArgs} args - Arguments to update one Signal.
     * @example
     * // Update one Signal
     * const signal = await prisma.signal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SignalUpdateArgs>(args: SelectSubset<T, SignalUpdateArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "update", ClientOptions>, never, ExtArgs, ClientOptions>

    /**
     * Delete zero or more Signals.
     * @param {SignalDeleteManyArgs} args - Arguments to filter Signals to delete.
     * @example
     * // Delete a few Signals
     * const { count } = await prisma.signal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SignalDeleteManyArgs>(args?: SelectSubset<T, SignalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Signals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Signals
     * const signal = await prisma.signal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SignalUpdateManyArgs>(args: SelectSubset<T, SignalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Signals and returns the data updated in the database.
     * @param {SignalUpdateManyAndReturnArgs} args - Arguments to update many Signals.
     * @example
     * // Update many Signals
     * const signal = await prisma.signal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Signals and only return the `id`
     * const signalWithIdOnly = await prisma.signal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SignalUpdateManyAndReturnArgs>(args: SelectSubset<T, SignalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "updateManyAndReturn", ClientOptions>>

    /**
     * Create or update one Signal.
     * @param {SignalUpsertArgs} args - Arguments to update or create a Signal.
     * @example
     * // Update or create a Signal
     * const signal = await prisma.signal.upsert({
     *   create: {
     *     // ... data to create a Signal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Signal we want to update
     *   }
     * })
     */
    upsert<T extends SignalUpsertArgs>(args: SelectSubset<T, SignalUpsertArgs<ExtArgs>>): Prisma__SignalClient<$Result.GetResult<Prisma.$SignalPayload<ExtArgs>, T, "upsert", ClientOptions>, never, ExtArgs, ClientOptions>


    /**
     * Count the number of Signals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalCountArgs} args - Arguments to filter Signals to count.
     * @example
     * // Count the number of Signals
     * const count = await prisma.signal.count({
     *   where: {
     *     // ... the filter for the Signals we want to count
     *   }
     * })
    **/
    count<T extends SignalCountArgs>(
      args?: Subset<T, SignalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SignalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Signal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SignalAggregateArgs>(args: Subset<T, SignalAggregateArgs>): Prisma.PrismaPromise<GetSignalAggregateType<T>>

    /**
     * Group by Signal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SignalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SignalGroupByArgs['orderBy'] }
        : { orderBy?: SignalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SignalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSignalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Signal model
   */
  readonly fields: SignalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Signal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SignalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    observedListing<T extends ObservedListingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ObservedListingDefaultArgs<ExtArgs>>): Prisma__ObservedListingClient<$Result.GetResult<Prisma.$ObservedListingPayload<ExtArgs>, T, "findUniqueOrThrow", ClientOptions> | Null, Null, ExtArgs, ClientOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Signal model
   */ 
  interface SignalFieldRefs {
    readonly id: FieldRef<"Signal", 'String'>
    readonly type: FieldRef<"Signal", 'String'>
    readonly severity: FieldRef<"Signal", 'String'>
    readonly observedListingId: FieldRef<"Signal", 'String'>
    readonly matchedListingId: FieldRef<"Signal", 'String'>
    readonly payload: FieldRef<"Signal", 'String'>
    readonly status: FieldRef<"Signal", 'String'>
    readonly createdAt: FieldRef<"Signal", 'DateTime'>
    readonly updatedAt: FieldRef<"Signal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Signal findUnique
   */
  export type SignalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * Filter, which Signal to fetch.
     */
    where: SignalWhereUniqueInput
  }

  /**
   * Signal findUniqueOrThrow
   */
  export type SignalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * Filter, which Signal to fetch.
     */
    where: SignalWhereUniqueInput
  }

  /**
   * Signal findFirst
   */
  export type SignalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * Filter, which Signal to fetch.
     */
    where?: SignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signals to fetch.
     */
    orderBy?: SignalOrderByWithRelationInput | SignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Signals.
     */
    cursor?: SignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Signals.
     */
    distinct?: SignalScalarFieldEnum | SignalScalarFieldEnum[]
  }

  /**
   * Signal findFirstOrThrow
   */
  export type SignalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * Filter, which Signal to fetch.
     */
    where?: SignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signals to fetch.
     */
    orderBy?: SignalOrderByWithRelationInput | SignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Signals.
     */
    cursor?: SignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Signals.
     */
    distinct?: SignalScalarFieldEnum | SignalScalarFieldEnum[]
  }

  /**
   * Signal findMany
   */
  export type SignalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * Filter, which Signals to fetch.
     */
    where?: SignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signals to fetch.
     */
    orderBy?: SignalOrderByWithRelationInput | SignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Signals.
     */
    cursor?: SignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signals.
     */
    skip?: number
    distinct?: SignalScalarFieldEnum | SignalScalarFieldEnum[]
  }

  /**
   * Signal create
   */
  export type SignalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * The data needed to create a Signal.
     */
    data: XOR<SignalCreateInput, SignalUncheckedCreateInput>
  }

  /**
   * Signal createMany
   */
  export type SignalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Signals.
     */
    data: SignalCreateManyInput | SignalCreateManyInput[]
  }

  /**
   * Signal createManyAndReturn
   */
  export type SignalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * The data used to create many Signals.
     */
    data: SignalCreateManyInput | SignalCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Signal update
   */
  export type SignalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * The data needed to update a Signal.
     */
    data: XOR<SignalUpdateInput, SignalUncheckedUpdateInput>
    /**
     * Choose, which Signal to update.
     */
    where: SignalWhereUniqueInput
  }

  /**
   * Signal updateMany
   */
  export type SignalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Signals.
     */
    data: XOR<SignalUpdateManyMutationInput, SignalUncheckedUpdateManyInput>
    /**
     * Filter which Signals to update
     */
    where?: SignalWhereInput
    /**
     * Limit how many Signals to update.
     */
    limit?: number
  }

  /**
   * Signal updateManyAndReturn
   */
  export type SignalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * The data used to update Signals.
     */
    data: XOR<SignalUpdateManyMutationInput, SignalUncheckedUpdateManyInput>
    /**
     * Filter which Signals to update
     */
    where?: SignalWhereInput
    /**
     * Limit how many Signals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Signal upsert
   */
  export type SignalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * The filter to search for the Signal to update in case it exists.
     */
    where: SignalWhereUniqueInput
    /**
     * In case the Signal found by the `where` argument doesn't exist, create a new Signal with this data.
     */
    create: XOR<SignalCreateInput, SignalUncheckedCreateInput>
    /**
     * In case the Signal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SignalUpdateInput, SignalUncheckedUpdateInput>
  }

  /**
   * Signal delete
   */
  export type SignalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
    /**
     * Filter which Signal to delete.
     */
    where: SignalWhereUniqueInput
  }

  /**
   * Signal deleteMany
   */
  export type SignalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Signals to delete
     */
    where?: SignalWhereInput
    /**
     * Limit how many Signals to delete.
     */
    limit?: number
  }

  /**
   * Signal without action
   */
  export type SignalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signal
     */
    select?: SignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signal
     */
    omit?: SignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignalInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SourceProfileScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    baseUrl: 'baseUrl',
    trustScore: 'trustScore',
    isEnabled: 'isEnabled',
    config: 'config',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SourceProfileScalarFieldEnum = (typeof SourceProfileScalarFieldEnum)[keyof typeof SourceProfileScalarFieldEnum]


  export const CrawlEventScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    itemsFound: 'itemsFound',
    itemsNew: 'itemsNew',
    errors: 'errors'
  };

  export type CrawlEventScalarFieldEnum = (typeof CrawlEventScalarFieldEnum)[keyof typeof CrawlEventScalarFieldEnum]


  export const SourceSnapshotScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    externalId: 'externalId',
    url: 'url',
    fetchedAt: 'fetchedAt',
    rawHtml: 'rawHtml',
    rawJson: 'rawJson',
    contentHash: 'contentHash',
    imagesEnriched: 'imagesEnriched',
    enrichedAt: 'enrichedAt',
    enrichmentError: 'enrichmentError'
  };

  export type SourceSnapshotScalarFieldEnum = (typeof SourceSnapshotScalarFieldEnum)[keyof typeof SourceSnapshotScalarFieldEnum]


  export const ObservedListingScalarFieldEnum: {
    id: 'id',
    snapshotId: 'snapshotId',
    title: 'title',
    description: 'description',
    price: 'price',
    currency: 'currency',
    address: 'address',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    lat: 'lat',
    lng: 'lng',
    status: 'status',
    listedAt: 'listedAt',
    geoHash: 'geoHash',
    addressHash: 'addressHash',
    mediaHash: 'mediaHash',
    confidenceScore: 'confidenceScore',
    createdAt: 'createdAt'
  };

  export type ObservedListingScalarFieldEnum = (typeof ObservedListingScalarFieldEnum)[keyof typeof ObservedListingScalarFieldEnum]


  export const SignalScalarFieldEnum: {
    id: 'id',
    type: 'type',
    severity: 'severity',
    observedListingId: 'observedListingId',
    matchedListingId: 'matchedListingId',
    payload: 'payload',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SignalScalarFieldEnum = (typeof SignalScalarFieldEnum)[keyof typeof SignalScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type SourceProfileWhereInput = {
    AND?: SourceProfileWhereInput | SourceProfileWhereInput[]
    OR?: SourceProfileWhereInput[]
    NOT?: SourceProfileWhereInput | SourceProfileWhereInput[]
    id?: StringFilter<"SourceProfile"> | string
    name?: StringFilter<"SourceProfile"> | string
    type?: StringFilter<"SourceProfile"> | string
    baseUrl?: StringFilter<"SourceProfile"> | string
    trustScore?: IntFilter<"SourceProfile"> | number
    isEnabled?: BoolFilter<"SourceProfile"> | boolean
    config?: StringFilter<"SourceProfile"> | string
    createdAt?: DateTimeFilter<"SourceProfile"> | Date | string
    updatedAt?: DateTimeFilter<"SourceProfile"> | Date | string
    snapshots?: SourceSnapshotListRelationFilter
    crawlEvents?: CrawlEventListRelationFilter
  }

  export type SourceProfileOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    baseUrl?: SortOrder
    trustScore?: SortOrder
    isEnabled?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    snapshots?: SourceSnapshotOrderByRelationAggregateInput
    crawlEvents?: CrawlEventOrderByRelationAggregateInput
  }

  export type SourceProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: SourceProfileWhereInput | SourceProfileWhereInput[]
    OR?: SourceProfileWhereInput[]
    NOT?: SourceProfileWhereInput | SourceProfileWhereInput[]
    type?: StringFilter<"SourceProfile"> | string
    baseUrl?: StringFilter<"SourceProfile"> | string
    trustScore?: IntFilter<"SourceProfile"> | number
    isEnabled?: BoolFilter<"SourceProfile"> | boolean
    config?: StringFilter<"SourceProfile"> | string
    createdAt?: DateTimeFilter<"SourceProfile"> | Date | string
    updatedAt?: DateTimeFilter<"SourceProfile"> | Date | string
    snapshots?: SourceSnapshotListRelationFilter
    crawlEvents?: CrawlEventListRelationFilter
  }, "id" | "name">

  export type SourceProfileOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    baseUrl?: SortOrder
    trustScore?: SortOrder
    isEnabled?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SourceProfileCountOrderByAggregateInput
    _avg?: SourceProfileAvgOrderByAggregateInput
    _max?: SourceProfileMaxOrderByAggregateInput
    _min?: SourceProfileMinOrderByAggregateInput
    _sum?: SourceProfileSumOrderByAggregateInput
  }

  export type SourceProfileScalarWhereWithAggregatesInput = {
    AND?: SourceProfileScalarWhereWithAggregatesInput | SourceProfileScalarWhereWithAggregatesInput[]
    OR?: SourceProfileScalarWhereWithAggregatesInput[]
    NOT?: SourceProfileScalarWhereWithAggregatesInput | SourceProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SourceProfile"> | string
    name?: StringWithAggregatesFilter<"SourceProfile"> | string
    type?: StringWithAggregatesFilter<"SourceProfile"> | string
    baseUrl?: StringWithAggregatesFilter<"SourceProfile"> | string
    trustScore?: IntWithAggregatesFilter<"SourceProfile"> | number
    isEnabled?: BoolWithAggregatesFilter<"SourceProfile"> | boolean
    config?: StringWithAggregatesFilter<"SourceProfile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SourceProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SourceProfile"> | Date | string
  }

  export type CrawlEventWhereInput = {
    AND?: CrawlEventWhereInput | CrawlEventWhereInput[]
    OR?: CrawlEventWhereInput[]
    NOT?: CrawlEventWhereInput | CrawlEventWhereInput[]
    id?: StringFilter<"CrawlEvent"> | string
    sourceId?: StringFilter<"CrawlEvent"> | string
    startTime?: DateTimeFilter<"CrawlEvent"> | Date | string
    endTime?: DateTimeNullableFilter<"CrawlEvent"> | Date | string | null
    status?: StringFilter<"CrawlEvent"> | string
    itemsFound?: IntFilter<"CrawlEvent"> | number
    itemsNew?: IntFilter<"CrawlEvent"> | number
    errors?: StringNullableFilter<"CrawlEvent"> | string | null
    source?: XOR<SourceProfileScalarRelationFilter, SourceProfileWhereInput>
  }

  export type CrawlEventOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrderInput | SortOrder
    status?: SortOrder
    itemsFound?: SortOrder
    itemsNew?: SortOrder
    errors?: SortOrderInput | SortOrder
    source?: SourceProfileOrderByWithRelationInput
  }

  export type CrawlEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CrawlEventWhereInput | CrawlEventWhereInput[]
    OR?: CrawlEventWhereInput[]
    NOT?: CrawlEventWhereInput | CrawlEventWhereInput[]
    sourceId?: StringFilter<"CrawlEvent"> | string
    startTime?: DateTimeFilter<"CrawlEvent"> | Date | string
    endTime?: DateTimeNullableFilter<"CrawlEvent"> | Date | string | null
    status?: StringFilter<"CrawlEvent"> | string
    itemsFound?: IntFilter<"CrawlEvent"> | number
    itemsNew?: IntFilter<"CrawlEvent"> | number
    errors?: StringNullableFilter<"CrawlEvent"> | string | null
    source?: XOR<SourceProfileScalarRelationFilter, SourceProfileWhereInput>
  }, "id">

  export type CrawlEventOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrderInput | SortOrder
    status?: SortOrder
    itemsFound?: SortOrder
    itemsNew?: SortOrder
    errors?: SortOrderInput | SortOrder
    _count?: CrawlEventCountOrderByAggregateInput
    _avg?: CrawlEventAvgOrderByAggregateInput
    _max?: CrawlEventMaxOrderByAggregateInput
    _min?: CrawlEventMinOrderByAggregateInput
    _sum?: CrawlEventSumOrderByAggregateInput
  }

  export type CrawlEventScalarWhereWithAggregatesInput = {
    AND?: CrawlEventScalarWhereWithAggregatesInput | CrawlEventScalarWhereWithAggregatesInput[]
    OR?: CrawlEventScalarWhereWithAggregatesInput[]
    NOT?: CrawlEventScalarWhereWithAggregatesInput | CrawlEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CrawlEvent"> | string
    sourceId?: StringWithAggregatesFilter<"CrawlEvent"> | string
    startTime?: DateTimeWithAggregatesFilter<"CrawlEvent"> | Date | string
    endTime?: DateTimeNullableWithAggregatesFilter<"CrawlEvent"> | Date | string | null
    status?: StringWithAggregatesFilter<"CrawlEvent"> | string
    itemsFound?: IntWithAggregatesFilter<"CrawlEvent"> | number
    itemsNew?: IntWithAggregatesFilter<"CrawlEvent"> | number
    errors?: StringNullableWithAggregatesFilter<"CrawlEvent"> | string | null
  }

  export type SourceSnapshotWhereInput = {
    AND?: SourceSnapshotWhereInput | SourceSnapshotWhereInput[]
    OR?: SourceSnapshotWhereInput[]
    NOT?: SourceSnapshotWhereInput | SourceSnapshotWhereInput[]
    id?: StringFilter<"SourceSnapshot"> | string
    sourceId?: StringFilter<"SourceSnapshot"> | string
    externalId?: StringFilter<"SourceSnapshot"> | string
    url?: StringFilter<"SourceSnapshot"> | string
    fetchedAt?: DateTimeFilter<"SourceSnapshot"> | Date | string
    rawHtml?: StringNullableFilter<"SourceSnapshot"> | string | null
    rawJson?: StringNullableFilter<"SourceSnapshot"> | string | null
    contentHash?: StringFilter<"SourceSnapshot"> | string
    imagesEnriched?: BoolFilter<"SourceSnapshot"> | boolean
    enrichedAt?: DateTimeNullableFilter<"SourceSnapshot"> | Date | string | null
    enrichmentError?: StringNullableFilter<"SourceSnapshot"> | string | null
    source?: XOR<SourceProfileScalarRelationFilter, SourceProfileWhereInput>
    observedListing?: XOR<ObservedListingNullableScalarRelationFilter, ObservedListingWhereInput> | null
  }

  export type SourceSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    fetchedAt?: SortOrder
    rawHtml?: SortOrderInput | SortOrder
    rawJson?: SortOrderInput | SortOrder
    contentHash?: SortOrder
    imagesEnriched?: SortOrder
    enrichedAt?: SortOrderInput | SortOrder
    enrichmentError?: SortOrderInput | SortOrder
    source?: SourceProfileOrderByWithRelationInput
    observedListing?: ObservedListingOrderByWithRelationInput
  }

  export type SourceSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SourceSnapshotWhereInput | SourceSnapshotWhereInput[]
    OR?: SourceSnapshotWhereInput[]
    NOT?: SourceSnapshotWhereInput | SourceSnapshotWhereInput[]
    sourceId?: StringFilter<"SourceSnapshot"> | string
    externalId?: StringFilter<"SourceSnapshot"> | string
    url?: StringFilter<"SourceSnapshot"> | string
    fetchedAt?: DateTimeFilter<"SourceSnapshot"> | Date | string
    rawHtml?: StringNullableFilter<"SourceSnapshot"> | string | null
    rawJson?: StringNullableFilter<"SourceSnapshot"> | string | null
    contentHash?: StringFilter<"SourceSnapshot"> | string
    imagesEnriched?: BoolFilter<"SourceSnapshot"> | boolean
    enrichedAt?: DateTimeNullableFilter<"SourceSnapshot"> | Date | string | null
    enrichmentError?: StringNullableFilter<"SourceSnapshot"> | string | null
    source?: XOR<SourceProfileScalarRelationFilter, SourceProfileWhereInput>
    observedListing?: XOR<ObservedListingNullableScalarRelationFilter, ObservedListingWhereInput> | null
  }, "id">

  export type SourceSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    fetchedAt?: SortOrder
    rawHtml?: SortOrderInput | SortOrder
    rawJson?: SortOrderInput | SortOrder
    contentHash?: SortOrder
    imagesEnriched?: SortOrder
    enrichedAt?: SortOrderInput | SortOrder
    enrichmentError?: SortOrderInput | SortOrder
    _count?: SourceSnapshotCountOrderByAggregateInput
    _max?: SourceSnapshotMaxOrderByAggregateInput
    _min?: SourceSnapshotMinOrderByAggregateInput
  }

  export type SourceSnapshotScalarWhereWithAggregatesInput = {
    AND?: SourceSnapshotScalarWhereWithAggregatesInput | SourceSnapshotScalarWhereWithAggregatesInput[]
    OR?: SourceSnapshotScalarWhereWithAggregatesInput[]
    NOT?: SourceSnapshotScalarWhereWithAggregatesInput | SourceSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SourceSnapshot"> | string
    sourceId?: StringWithAggregatesFilter<"SourceSnapshot"> | string
    externalId?: StringWithAggregatesFilter<"SourceSnapshot"> | string
    url?: StringWithAggregatesFilter<"SourceSnapshot"> | string
    fetchedAt?: DateTimeWithAggregatesFilter<"SourceSnapshot"> | Date | string
    rawHtml?: StringNullableWithAggregatesFilter<"SourceSnapshot"> | string | null
    rawJson?: StringNullableWithAggregatesFilter<"SourceSnapshot"> | string | null
    contentHash?: StringWithAggregatesFilter<"SourceSnapshot"> | string
    imagesEnriched?: BoolWithAggregatesFilter<"SourceSnapshot"> | boolean
    enrichedAt?: DateTimeNullableWithAggregatesFilter<"SourceSnapshot"> | Date | string | null
    enrichmentError?: StringNullableWithAggregatesFilter<"SourceSnapshot"> | string | null
  }

  export type ObservedListingWhereInput = {
    AND?: ObservedListingWhereInput | ObservedListingWhereInput[]
    OR?: ObservedListingWhereInput[]
    NOT?: ObservedListingWhereInput | ObservedListingWhereInput[]
    id?: StringFilter<"ObservedListing"> | string
    snapshotId?: StringFilter<"ObservedListing"> | string
    title?: StringNullableFilter<"ObservedListing"> | string | null
    description?: StringNullableFilter<"ObservedListing"> | string | null
    price?: FloatNullableFilter<"ObservedListing"> | number | null
    currency?: StringFilter<"ObservedListing"> | string
    address?: StringNullableFilter<"ObservedListing"> | string | null
    city?: StringNullableFilter<"ObservedListing"> | string | null
    state?: StringNullableFilter<"ObservedListing"> | string | null
    zipCode?: StringNullableFilter<"ObservedListing"> | string | null
    lat?: FloatNullableFilter<"ObservedListing"> | number | null
    lng?: FloatNullableFilter<"ObservedListing"> | number | null
    status?: StringNullableFilter<"ObservedListing"> | string | null
    listedAt?: DateTimeNullableFilter<"ObservedListing"> | Date | string | null
    geoHash?: StringNullableFilter<"ObservedListing"> | string | null
    addressHash?: StringNullableFilter<"ObservedListing"> | string | null
    mediaHash?: StringNullableFilter<"ObservedListing"> | string | null
    confidenceScore?: FloatFilter<"ObservedListing"> | number
    createdAt?: DateTimeFilter<"ObservedListing"> | Date | string
    snapshot?: XOR<SourceSnapshotScalarRelationFilter, SourceSnapshotWhereInput>
    signals?: SignalListRelationFilter
  }

  export type ObservedListingOrderByWithRelationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    currency?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    listedAt?: SortOrderInput | SortOrder
    geoHash?: SortOrderInput | SortOrder
    addressHash?: SortOrderInput | SortOrder
    mediaHash?: SortOrderInput | SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
    snapshot?: SourceSnapshotOrderByWithRelationInput
    signals?: SignalOrderByRelationAggregateInput
  }

  export type ObservedListingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    snapshotId?: string
    AND?: ObservedListingWhereInput | ObservedListingWhereInput[]
    OR?: ObservedListingWhereInput[]
    NOT?: ObservedListingWhereInput | ObservedListingWhereInput[]
    title?: StringNullableFilter<"ObservedListing"> | string | null
    description?: StringNullableFilter<"ObservedListing"> | string | null
    price?: FloatNullableFilter<"ObservedListing"> | number | null
    currency?: StringFilter<"ObservedListing"> | string
    address?: StringNullableFilter<"ObservedListing"> | string | null
    city?: StringNullableFilter<"ObservedListing"> | string | null
    state?: StringNullableFilter<"ObservedListing"> | string | null
    zipCode?: StringNullableFilter<"ObservedListing"> | string | null
    lat?: FloatNullableFilter<"ObservedListing"> | number | null
    lng?: FloatNullableFilter<"ObservedListing"> | number | null
    status?: StringNullableFilter<"ObservedListing"> | string | null
    listedAt?: DateTimeNullableFilter<"ObservedListing"> | Date | string | null
    geoHash?: StringNullableFilter<"ObservedListing"> | string | null
    addressHash?: StringNullableFilter<"ObservedListing"> | string | null
    mediaHash?: StringNullableFilter<"ObservedListing"> | string | null
    confidenceScore?: FloatFilter<"ObservedListing"> | number
    createdAt?: DateTimeFilter<"ObservedListing"> | Date | string
    snapshot?: XOR<SourceSnapshotScalarRelationFilter, SourceSnapshotWhereInput>
    signals?: SignalListRelationFilter
  }, "id" | "snapshotId">

  export type ObservedListingOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    currency?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    listedAt?: SortOrderInput | SortOrder
    geoHash?: SortOrderInput | SortOrder
    addressHash?: SortOrderInput | SortOrder
    mediaHash?: SortOrderInput | SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
    _count?: ObservedListingCountOrderByAggregateInput
    _avg?: ObservedListingAvgOrderByAggregateInput
    _max?: ObservedListingMaxOrderByAggregateInput
    _min?: ObservedListingMinOrderByAggregateInput
    _sum?: ObservedListingSumOrderByAggregateInput
  }

  export type ObservedListingScalarWhereWithAggregatesInput = {
    AND?: ObservedListingScalarWhereWithAggregatesInput | ObservedListingScalarWhereWithAggregatesInput[]
    OR?: ObservedListingScalarWhereWithAggregatesInput[]
    NOT?: ObservedListingScalarWhereWithAggregatesInput | ObservedListingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ObservedListing"> | string
    snapshotId?: StringWithAggregatesFilter<"ObservedListing"> | string
    title?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    description?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    price?: FloatNullableWithAggregatesFilter<"ObservedListing"> | number | null
    currency?: StringWithAggregatesFilter<"ObservedListing"> | string
    address?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    city?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    state?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    zipCode?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    lat?: FloatNullableWithAggregatesFilter<"ObservedListing"> | number | null
    lng?: FloatNullableWithAggregatesFilter<"ObservedListing"> | number | null
    status?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    listedAt?: DateTimeNullableWithAggregatesFilter<"ObservedListing"> | Date | string | null
    geoHash?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    addressHash?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    mediaHash?: StringNullableWithAggregatesFilter<"ObservedListing"> | string | null
    confidenceScore?: FloatWithAggregatesFilter<"ObservedListing"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ObservedListing"> | Date | string
  }

  export type SignalWhereInput = {
    AND?: SignalWhereInput | SignalWhereInput[]
    OR?: SignalWhereInput[]
    NOT?: SignalWhereInput | SignalWhereInput[]
    id?: StringFilter<"Signal"> | string
    type?: StringFilter<"Signal"> | string
    severity?: StringFilter<"Signal"> | string
    observedListingId?: StringFilter<"Signal"> | string
    matchedListingId?: StringNullableFilter<"Signal"> | string | null
    payload?: StringFilter<"Signal"> | string
    status?: StringFilter<"Signal"> | string
    createdAt?: DateTimeFilter<"Signal"> | Date | string
    updatedAt?: DateTimeFilter<"Signal"> | Date | string
    observedListing?: XOR<ObservedListingScalarRelationFilter, ObservedListingWhereInput>
  }

  export type SignalOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    observedListingId?: SortOrder
    matchedListingId?: SortOrderInput | SortOrder
    payload?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    observedListing?: ObservedListingOrderByWithRelationInput
  }

  export type SignalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SignalWhereInput | SignalWhereInput[]
    OR?: SignalWhereInput[]
    NOT?: SignalWhereInput | SignalWhereInput[]
    type?: StringFilter<"Signal"> | string
    severity?: StringFilter<"Signal"> | string
    observedListingId?: StringFilter<"Signal"> | string
    matchedListingId?: StringNullableFilter<"Signal"> | string | null
    payload?: StringFilter<"Signal"> | string
    status?: StringFilter<"Signal"> | string
    createdAt?: DateTimeFilter<"Signal"> | Date | string
    updatedAt?: DateTimeFilter<"Signal"> | Date | string
    observedListing?: XOR<ObservedListingScalarRelationFilter, ObservedListingWhereInput>
  }, "id">

  export type SignalOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    observedListingId?: SortOrder
    matchedListingId?: SortOrderInput | SortOrder
    payload?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SignalCountOrderByAggregateInput
    _max?: SignalMaxOrderByAggregateInput
    _min?: SignalMinOrderByAggregateInput
  }

  export type SignalScalarWhereWithAggregatesInput = {
    AND?: SignalScalarWhereWithAggregatesInput | SignalScalarWhereWithAggregatesInput[]
    OR?: SignalScalarWhereWithAggregatesInput[]
    NOT?: SignalScalarWhereWithAggregatesInput | SignalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Signal"> | string
    type?: StringWithAggregatesFilter<"Signal"> | string
    severity?: StringWithAggregatesFilter<"Signal"> | string
    observedListingId?: StringWithAggregatesFilter<"Signal"> | string
    matchedListingId?: StringNullableWithAggregatesFilter<"Signal"> | string | null
    payload?: StringWithAggregatesFilter<"Signal"> | string
    status?: StringWithAggregatesFilter<"Signal"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Signal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Signal"> | Date | string
  }

  export type SourceProfileCreateInput = {
    id?: string
    name: string
    type: string
    baseUrl: string
    trustScore?: number
    isEnabled?: boolean
    config: string
    createdAt?: Date | string
    updatedAt?: Date | string
    snapshots?: SourceSnapshotCreateNestedManyWithoutSourceInput
    crawlEvents?: CrawlEventCreateNestedManyWithoutSourceInput
  }

  export type SourceProfileUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    baseUrl: string
    trustScore?: number
    isEnabled?: boolean
    config: string
    createdAt?: Date | string
    updatedAt?: Date | string
    snapshots?: SourceSnapshotUncheckedCreateNestedManyWithoutSourceInput
    crawlEvents?: CrawlEventUncheckedCreateNestedManyWithoutSourceInput
  }

  export type SourceProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshots?: SourceSnapshotUpdateManyWithoutSourceNestedInput
    crawlEvents?: CrawlEventUpdateManyWithoutSourceNestedInput
  }

  export type SourceProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshots?: SourceSnapshotUncheckedUpdateManyWithoutSourceNestedInput
    crawlEvents?: CrawlEventUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type SourceProfileCreateManyInput = {
    id?: string
    name: string
    type: string
    baseUrl: string
    trustScore?: number
    isEnabled?: boolean
    config: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SourceProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrawlEventCreateInput = {
    id?: string
    startTime?: Date | string
    endTime?: Date | string | null
    status: string
    itemsFound?: number
    itemsNew?: number
    errors?: string | null
    source: SourceProfileCreateNestedOneWithoutCrawlEventsInput
  }

  export type CrawlEventUncheckedCreateInput = {
    id?: string
    sourceId: string
    startTime?: Date | string
    endTime?: Date | string | null
    status: string
    itemsFound?: number
    itemsNew?: number
    errors?: string | null
  }

  export type CrawlEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    itemsFound?: IntFieldUpdateOperationsInput | number
    itemsNew?: IntFieldUpdateOperationsInput | number
    errors?: NullableStringFieldUpdateOperationsInput | string | null
    source?: SourceProfileUpdateOneRequiredWithoutCrawlEventsNestedInput
  }

  export type CrawlEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    itemsFound?: IntFieldUpdateOperationsInput | number
    itemsNew?: IntFieldUpdateOperationsInput | number
    errors?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CrawlEventCreateManyInput = {
    id?: string
    sourceId: string
    startTime?: Date | string
    endTime?: Date | string | null
    status: string
    itemsFound?: number
    itemsNew?: number
    errors?: string | null
  }

  export type CrawlEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    itemsFound?: IntFieldUpdateOperationsInput | number
    itemsNew?: IntFieldUpdateOperationsInput | number
    errors?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CrawlEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    itemsFound?: IntFieldUpdateOperationsInput | number
    itemsNew?: IntFieldUpdateOperationsInput | number
    errors?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SourceSnapshotCreateInput = {
    id?: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
    source: SourceProfileCreateNestedOneWithoutSnapshotsInput
    observedListing?: ObservedListingCreateNestedOneWithoutSnapshotInput
  }

  export type SourceSnapshotUncheckedCreateInput = {
    id?: string
    sourceId: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
    observedListing?: ObservedListingUncheckedCreateNestedOneWithoutSnapshotInput
  }

  export type SourceSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
    source?: SourceProfileUpdateOneRequiredWithoutSnapshotsNestedInput
    observedListing?: ObservedListingUpdateOneWithoutSnapshotNestedInput
  }

  export type SourceSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
    observedListing?: ObservedListingUncheckedUpdateOneWithoutSnapshotNestedInput
  }

  export type SourceSnapshotCreateManyInput = {
    id?: string
    sourceId: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
  }

  export type SourceSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SourceSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObservedListingCreateInput = {
    id?: string
    title?: string | null
    description?: string | null
    price?: number | null
    currency?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    lat?: number | null
    lng?: number | null
    status?: string | null
    listedAt?: Date | string | null
    geoHash?: string | null
    addressHash?: string | null
    mediaHash?: string | null
    confidenceScore?: number
    createdAt?: Date | string
    snapshot: SourceSnapshotCreateNestedOneWithoutObservedListingInput
    signals?: SignalCreateNestedManyWithoutObservedListingInput
  }

  export type ObservedListingUncheckedCreateInput = {
    id?: string
    snapshotId: string
    title?: string | null
    description?: string | null
    price?: number | null
    currency?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    lat?: number | null
    lng?: number | null
    status?: string | null
    listedAt?: Date | string | null
    geoHash?: string | null
    addressHash?: string | null
    mediaHash?: string | null
    confidenceScore?: number
    createdAt?: Date | string
    signals?: SignalUncheckedCreateNestedManyWithoutObservedListingInput
  }

  export type ObservedListingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshot?: SourceSnapshotUpdateOneRequiredWithoutObservedListingNestedInput
    signals?: SignalUpdateManyWithoutObservedListingNestedInput
  }

  export type ObservedListingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signals?: SignalUncheckedUpdateManyWithoutObservedListingNestedInput
  }

  export type ObservedListingCreateManyInput = {
    id?: string
    snapshotId: string
    title?: string | null
    description?: string | null
    price?: number | null
    currency?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    lat?: number | null
    lng?: number | null
    status?: string | null
    listedAt?: Date | string | null
    geoHash?: string | null
    addressHash?: string | null
    mediaHash?: string | null
    confidenceScore?: number
    createdAt?: Date | string
  }

  export type ObservedListingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObservedListingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalCreateInput = {
    id?: string
    type: string
    severity: string
    matchedListingId?: string | null
    payload: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    observedListing: ObservedListingCreateNestedOneWithoutSignalsInput
  }

  export type SignalUncheckedCreateInput = {
    id?: string
    type: string
    severity: string
    observedListingId: string
    matchedListingId?: string | null
    payload: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    matchedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    observedListing?: ObservedListingUpdateOneRequiredWithoutSignalsNestedInput
  }

  export type SignalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    observedListingId?: StringFieldUpdateOperationsInput | string
    matchedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalCreateManyInput = {
    id?: string
    type: string
    severity: string
    observedListingId: string
    matchedListingId?: string | null
    payload: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    matchedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    observedListingId?: StringFieldUpdateOperationsInput | string
    matchedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SourceSnapshotListRelationFilter = {
    every?: SourceSnapshotWhereInput
    some?: SourceSnapshotWhereInput
    none?: SourceSnapshotWhereInput
  }

  export type CrawlEventListRelationFilter = {
    every?: CrawlEventWhereInput
    some?: CrawlEventWhereInput
    none?: CrawlEventWhereInput
  }

  export type SourceSnapshotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CrawlEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SourceProfileCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    baseUrl?: SortOrder
    trustScore?: SortOrder
    isEnabled?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SourceProfileAvgOrderByAggregateInput = {
    trustScore?: SortOrder
  }

  export type SourceProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    baseUrl?: SortOrder
    trustScore?: SortOrder
    isEnabled?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SourceProfileMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    baseUrl?: SortOrder
    trustScore?: SortOrder
    isEnabled?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SourceProfileSumOrderByAggregateInput = {
    trustScore?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SourceProfileScalarRelationFilter = {
    is?: SourceProfileWhereInput
    isNot?: SourceProfileWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CrawlEventCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    itemsFound?: SortOrder
    itemsNew?: SortOrder
    errors?: SortOrder
  }

  export type CrawlEventAvgOrderByAggregateInput = {
    itemsFound?: SortOrder
    itemsNew?: SortOrder
  }

  export type CrawlEventMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    itemsFound?: SortOrder
    itemsNew?: SortOrder
    errors?: SortOrder
  }

  export type CrawlEventMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    itemsFound?: SortOrder
    itemsNew?: SortOrder
    errors?: SortOrder
  }

  export type CrawlEventSumOrderByAggregateInput = {
    itemsFound?: SortOrder
    itemsNew?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ObservedListingNullableScalarRelationFilter = {
    is?: ObservedListingWhereInput | null
    isNot?: ObservedListingWhereInput | null
  }

  export type SourceSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    fetchedAt?: SortOrder
    rawHtml?: SortOrder
    rawJson?: SortOrder
    contentHash?: SortOrder
    imagesEnriched?: SortOrder
    enrichedAt?: SortOrder
    enrichmentError?: SortOrder
  }

  export type SourceSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    fetchedAt?: SortOrder
    rawHtml?: SortOrder
    rawJson?: SortOrder
    contentHash?: SortOrder
    imagesEnriched?: SortOrder
    enrichedAt?: SortOrder
    enrichmentError?: SortOrder
  }

  export type SourceSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    externalId?: SortOrder
    url?: SortOrder
    fetchedAt?: SortOrder
    rawHtml?: SortOrder
    rawJson?: SortOrder
    contentHash?: SortOrder
    imagesEnriched?: SortOrder
    enrichedAt?: SortOrder
    enrichmentError?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type SourceSnapshotScalarRelationFilter = {
    is?: SourceSnapshotWhereInput
    isNot?: SourceSnapshotWhereInput
  }

  export type SignalListRelationFilter = {
    every?: SignalWhereInput
    some?: SignalWhereInput
    none?: SignalWhereInput
  }

  export type SignalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ObservedListingCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    status?: SortOrder
    listedAt?: SortOrder
    geoHash?: SortOrder
    addressHash?: SortOrder
    mediaHash?: SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
  }

  export type ObservedListingAvgOrderByAggregateInput = {
    price?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    confidenceScore?: SortOrder
  }

  export type ObservedListingMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    status?: SortOrder
    listedAt?: SortOrder
    geoHash?: SortOrder
    addressHash?: SortOrder
    mediaHash?: SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
  }

  export type ObservedListingMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    status?: SortOrder
    listedAt?: SortOrder
    geoHash?: SortOrder
    addressHash?: SortOrder
    mediaHash?: SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
  }

  export type ObservedListingSumOrderByAggregateInput = {
    price?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    confidenceScore?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ObservedListingScalarRelationFilter = {
    is?: ObservedListingWhereInput
    isNot?: ObservedListingWhereInput
  }

  export type SignalCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    observedListingId?: SortOrder
    matchedListingId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    observedListingId?: SortOrder
    matchedListingId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    observedListingId?: SortOrder
    matchedListingId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SourceSnapshotCreateNestedManyWithoutSourceInput = {
    create?: XOR<SourceSnapshotCreateWithoutSourceInput, SourceSnapshotUncheckedCreateWithoutSourceInput> | SourceSnapshotCreateWithoutSourceInput[] | SourceSnapshotUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceSnapshotCreateOrConnectWithoutSourceInput | SourceSnapshotCreateOrConnectWithoutSourceInput[]
    createMany?: SourceSnapshotCreateManySourceInputEnvelope
    connect?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
  }

  export type CrawlEventCreateNestedManyWithoutSourceInput = {
    create?: XOR<CrawlEventCreateWithoutSourceInput, CrawlEventUncheckedCreateWithoutSourceInput> | CrawlEventCreateWithoutSourceInput[] | CrawlEventUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: CrawlEventCreateOrConnectWithoutSourceInput | CrawlEventCreateOrConnectWithoutSourceInput[]
    createMany?: CrawlEventCreateManySourceInputEnvelope
    connect?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
  }

  export type SourceSnapshotUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<SourceSnapshotCreateWithoutSourceInput, SourceSnapshotUncheckedCreateWithoutSourceInput> | SourceSnapshotCreateWithoutSourceInput[] | SourceSnapshotUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceSnapshotCreateOrConnectWithoutSourceInput | SourceSnapshotCreateOrConnectWithoutSourceInput[]
    createMany?: SourceSnapshotCreateManySourceInputEnvelope
    connect?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
  }

  export type CrawlEventUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<CrawlEventCreateWithoutSourceInput, CrawlEventUncheckedCreateWithoutSourceInput> | CrawlEventCreateWithoutSourceInput[] | CrawlEventUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: CrawlEventCreateOrConnectWithoutSourceInput | CrawlEventCreateOrConnectWithoutSourceInput[]
    createMany?: CrawlEventCreateManySourceInputEnvelope
    connect?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SourceSnapshotUpdateManyWithoutSourceNestedInput = {
    create?: XOR<SourceSnapshotCreateWithoutSourceInput, SourceSnapshotUncheckedCreateWithoutSourceInput> | SourceSnapshotCreateWithoutSourceInput[] | SourceSnapshotUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceSnapshotCreateOrConnectWithoutSourceInput | SourceSnapshotCreateOrConnectWithoutSourceInput[]
    upsert?: SourceSnapshotUpsertWithWhereUniqueWithoutSourceInput | SourceSnapshotUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: SourceSnapshotCreateManySourceInputEnvelope
    set?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    disconnect?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    delete?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    connect?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    update?: SourceSnapshotUpdateWithWhereUniqueWithoutSourceInput | SourceSnapshotUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: SourceSnapshotUpdateManyWithWhereWithoutSourceInput | SourceSnapshotUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: SourceSnapshotScalarWhereInput | SourceSnapshotScalarWhereInput[]
  }

  export type CrawlEventUpdateManyWithoutSourceNestedInput = {
    create?: XOR<CrawlEventCreateWithoutSourceInput, CrawlEventUncheckedCreateWithoutSourceInput> | CrawlEventCreateWithoutSourceInput[] | CrawlEventUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: CrawlEventCreateOrConnectWithoutSourceInput | CrawlEventCreateOrConnectWithoutSourceInput[]
    upsert?: CrawlEventUpsertWithWhereUniqueWithoutSourceInput | CrawlEventUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: CrawlEventCreateManySourceInputEnvelope
    set?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    disconnect?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    delete?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    connect?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    update?: CrawlEventUpdateWithWhereUniqueWithoutSourceInput | CrawlEventUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: CrawlEventUpdateManyWithWhereWithoutSourceInput | CrawlEventUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: CrawlEventScalarWhereInput | CrawlEventScalarWhereInput[]
  }

  export type SourceSnapshotUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<SourceSnapshotCreateWithoutSourceInput, SourceSnapshotUncheckedCreateWithoutSourceInput> | SourceSnapshotCreateWithoutSourceInput[] | SourceSnapshotUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceSnapshotCreateOrConnectWithoutSourceInput | SourceSnapshotCreateOrConnectWithoutSourceInput[]
    upsert?: SourceSnapshotUpsertWithWhereUniqueWithoutSourceInput | SourceSnapshotUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: SourceSnapshotCreateManySourceInputEnvelope
    set?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    disconnect?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    delete?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    connect?: SourceSnapshotWhereUniqueInput | SourceSnapshotWhereUniqueInput[]
    update?: SourceSnapshotUpdateWithWhereUniqueWithoutSourceInput | SourceSnapshotUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: SourceSnapshotUpdateManyWithWhereWithoutSourceInput | SourceSnapshotUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: SourceSnapshotScalarWhereInput | SourceSnapshotScalarWhereInput[]
  }

  export type CrawlEventUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<CrawlEventCreateWithoutSourceInput, CrawlEventUncheckedCreateWithoutSourceInput> | CrawlEventCreateWithoutSourceInput[] | CrawlEventUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: CrawlEventCreateOrConnectWithoutSourceInput | CrawlEventCreateOrConnectWithoutSourceInput[]
    upsert?: CrawlEventUpsertWithWhereUniqueWithoutSourceInput | CrawlEventUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: CrawlEventCreateManySourceInputEnvelope
    set?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    disconnect?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    delete?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    connect?: CrawlEventWhereUniqueInput | CrawlEventWhereUniqueInput[]
    update?: CrawlEventUpdateWithWhereUniqueWithoutSourceInput | CrawlEventUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: CrawlEventUpdateManyWithWhereWithoutSourceInput | CrawlEventUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: CrawlEventScalarWhereInput | CrawlEventScalarWhereInput[]
  }

  export type SourceProfileCreateNestedOneWithoutCrawlEventsInput = {
    create?: XOR<SourceProfileCreateWithoutCrawlEventsInput, SourceProfileUncheckedCreateWithoutCrawlEventsInput>
    connectOrCreate?: SourceProfileCreateOrConnectWithoutCrawlEventsInput
    connect?: SourceProfileWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type SourceProfileUpdateOneRequiredWithoutCrawlEventsNestedInput = {
    create?: XOR<SourceProfileCreateWithoutCrawlEventsInput, SourceProfileUncheckedCreateWithoutCrawlEventsInput>
    connectOrCreate?: SourceProfileCreateOrConnectWithoutCrawlEventsInput
    upsert?: SourceProfileUpsertWithoutCrawlEventsInput
    connect?: SourceProfileWhereUniqueInput
    update?: XOR<XOR<SourceProfileUpdateToOneWithWhereWithoutCrawlEventsInput, SourceProfileUpdateWithoutCrawlEventsInput>, SourceProfileUncheckedUpdateWithoutCrawlEventsInput>
  }

  export type SourceProfileCreateNestedOneWithoutSnapshotsInput = {
    create?: XOR<SourceProfileCreateWithoutSnapshotsInput, SourceProfileUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: SourceProfileCreateOrConnectWithoutSnapshotsInput
    connect?: SourceProfileWhereUniqueInput
  }

  export type ObservedListingCreateNestedOneWithoutSnapshotInput = {
    create?: XOR<ObservedListingCreateWithoutSnapshotInput, ObservedListingUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ObservedListingCreateOrConnectWithoutSnapshotInput
    connect?: ObservedListingWhereUniqueInput
  }

  export type ObservedListingUncheckedCreateNestedOneWithoutSnapshotInput = {
    create?: XOR<ObservedListingCreateWithoutSnapshotInput, ObservedListingUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ObservedListingCreateOrConnectWithoutSnapshotInput
    connect?: ObservedListingWhereUniqueInput
  }

  export type SourceProfileUpdateOneRequiredWithoutSnapshotsNestedInput = {
    create?: XOR<SourceProfileCreateWithoutSnapshotsInput, SourceProfileUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: SourceProfileCreateOrConnectWithoutSnapshotsInput
    upsert?: SourceProfileUpsertWithoutSnapshotsInput
    connect?: SourceProfileWhereUniqueInput
    update?: XOR<XOR<SourceProfileUpdateToOneWithWhereWithoutSnapshotsInput, SourceProfileUpdateWithoutSnapshotsInput>, SourceProfileUncheckedUpdateWithoutSnapshotsInput>
  }

  export type ObservedListingUpdateOneWithoutSnapshotNestedInput = {
    create?: XOR<ObservedListingCreateWithoutSnapshotInput, ObservedListingUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ObservedListingCreateOrConnectWithoutSnapshotInput
    upsert?: ObservedListingUpsertWithoutSnapshotInput
    disconnect?: ObservedListingWhereInput | boolean
    delete?: ObservedListingWhereInput | boolean
    connect?: ObservedListingWhereUniqueInput
    update?: XOR<XOR<ObservedListingUpdateToOneWithWhereWithoutSnapshotInput, ObservedListingUpdateWithoutSnapshotInput>, ObservedListingUncheckedUpdateWithoutSnapshotInput>
  }

  export type ObservedListingUncheckedUpdateOneWithoutSnapshotNestedInput = {
    create?: XOR<ObservedListingCreateWithoutSnapshotInput, ObservedListingUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ObservedListingCreateOrConnectWithoutSnapshotInput
    upsert?: ObservedListingUpsertWithoutSnapshotInput
    disconnect?: ObservedListingWhereInput | boolean
    delete?: ObservedListingWhereInput | boolean
    connect?: ObservedListingWhereUniqueInput
    update?: XOR<XOR<ObservedListingUpdateToOneWithWhereWithoutSnapshotInput, ObservedListingUpdateWithoutSnapshotInput>, ObservedListingUncheckedUpdateWithoutSnapshotInput>
  }

  export type SourceSnapshotCreateNestedOneWithoutObservedListingInput = {
    create?: XOR<SourceSnapshotCreateWithoutObservedListingInput, SourceSnapshotUncheckedCreateWithoutObservedListingInput>
    connectOrCreate?: SourceSnapshotCreateOrConnectWithoutObservedListingInput
    connect?: SourceSnapshotWhereUniqueInput
  }

  export type SignalCreateNestedManyWithoutObservedListingInput = {
    create?: XOR<SignalCreateWithoutObservedListingInput, SignalUncheckedCreateWithoutObservedListingInput> | SignalCreateWithoutObservedListingInput[] | SignalUncheckedCreateWithoutObservedListingInput[]
    connectOrCreate?: SignalCreateOrConnectWithoutObservedListingInput | SignalCreateOrConnectWithoutObservedListingInput[]
    createMany?: SignalCreateManyObservedListingInputEnvelope
    connect?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
  }

  export type SignalUncheckedCreateNestedManyWithoutObservedListingInput = {
    create?: XOR<SignalCreateWithoutObservedListingInput, SignalUncheckedCreateWithoutObservedListingInput> | SignalCreateWithoutObservedListingInput[] | SignalUncheckedCreateWithoutObservedListingInput[]
    connectOrCreate?: SignalCreateOrConnectWithoutObservedListingInput | SignalCreateOrConnectWithoutObservedListingInput[]
    createMany?: SignalCreateManyObservedListingInputEnvelope
    connect?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SourceSnapshotUpdateOneRequiredWithoutObservedListingNestedInput = {
    create?: XOR<SourceSnapshotCreateWithoutObservedListingInput, SourceSnapshotUncheckedCreateWithoutObservedListingInput>
    connectOrCreate?: SourceSnapshotCreateOrConnectWithoutObservedListingInput
    upsert?: SourceSnapshotUpsertWithoutObservedListingInput
    connect?: SourceSnapshotWhereUniqueInput
    update?: XOR<XOR<SourceSnapshotUpdateToOneWithWhereWithoutObservedListingInput, SourceSnapshotUpdateWithoutObservedListingInput>, SourceSnapshotUncheckedUpdateWithoutObservedListingInput>
  }

  export type SignalUpdateManyWithoutObservedListingNestedInput = {
    create?: XOR<SignalCreateWithoutObservedListingInput, SignalUncheckedCreateWithoutObservedListingInput> | SignalCreateWithoutObservedListingInput[] | SignalUncheckedCreateWithoutObservedListingInput[]
    connectOrCreate?: SignalCreateOrConnectWithoutObservedListingInput | SignalCreateOrConnectWithoutObservedListingInput[]
    upsert?: SignalUpsertWithWhereUniqueWithoutObservedListingInput | SignalUpsertWithWhereUniqueWithoutObservedListingInput[]
    createMany?: SignalCreateManyObservedListingInputEnvelope
    set?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    disconnect?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    delete?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    connect?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    update?: SignalUpdateWithWhereUniqueWithoutObservedListingInput | SignalUpdateWithWhereUniqueWithoutObservedListingInput[]
    updateMany?: SignalUpdateManyWithWhereWithoutObservedListingInput | SignalUpdateManyWithWhereWithoutObservedListingInput[]
    deleteMany?: SignalScalarWhereInput | SignalScalarWhereInput[]
  }

  export type SignalUncheckedUpdateManyWithoutObservedListingNestedInput = {
    create?: XOR<SignalCreateWithoutObservedListingInput, SignalUncheckedCreateWithoutObservedListingInput> | SignalCreateWithoutObservedListingInput[] | SignalUncheckedCreateWithoutObservedListingInput[]
    connectOrCreate?: SignalCreateOrConnectWithoutObservedListingInput | SignalCreateOrConnectWithoutObservedListingInput[]
    upsert?: SignalUpsertWithWhereUniqueWithoutObservedListingInput | SignalUpsertWithWhereUniqueWithoutObservedListingInput[]
    createMany?: SignalCreateManyObservedListingInputEnvelope
    set?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    disconnect?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    delete?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    connect?: SignalWhereUniqueInput | SignalWhereUniqueInput[]
    update?: SignalUpdateWithWhereUniqueWithoutObservedListingInput | SignalUpdateWithWhereUniqueWithoutObservedListingInput[]
    updateMany?: SignalUpdateManyWithWhereWithoutObservedListingInput | SignalUpdateManyWithWhereWithoutObservedListingInput[]
    deleteMany?: SignalScalarWhereInput | SignalScalarWhereInput[]
  }

  export type ObservedListingCreateNestedOneWithoutSignalsInput = {
    create?: XOR<ObservedListingCreateWithoutSignalsInput, ObservedListingUncheckedCreateWithoutSignalsInput>
    connectOrCreate?: ObservedListingCreateOrConnectWithoutSignalsInput
    connect?: ObservedListingWhereUniqueInput
  }

  export type ObservedListingUpdateOneRequiredWithoutSignalsNestedInput = {
    create?: XOR<ObservedListingCreateWithoutSignalsInput, ObservedListingUncheckedCreateWithoutSignalsInput>
    connectOrCreate?: ObservedListingCreateOrConnectWithoutSignalsInput
    upsert?: ObservedListingUpsertWithoutSignalsInput
    connect?: ObservedListingWhereUniqueInput
    update?: XOR<XOR<ObservedListingUpdateToOneWithWhereWithoutSignalsInput, ObservedListingUpdateWithoutSignalsInput>, ObservedListingUncheckedUpdateWithoutSignalsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SourceSnapshotCreateWithoutSourceInput = {
    id?: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
    observedListing?: ObservedListingCreateNestedOneWithoutSnapshotInput
  }

  export type SourceSnapshotUncheckedCreateWithoutSourceInput = {
    id?: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
    observedListing?: ObservedListingUncheckedCreateNestedOneWithoutSnapshotInput
  }

  export type SourceSnapshotCreateOrConnectWithoutSourceInput = {
    where: SourceSnapshotWhereUniqueInput
    create: XOR<SourceSnapshotCreateWithoutSourceInput, SourceSnapshotUncheckedCreateWithoutSourceInput>
  }

  export type SourceSnapshotCreateManySourceInputEnvelope = {
    data: SourceSnapshotCreateManySourceInput | SourceSnapshotCreateManySourceInput[]
  }

  export type CrawlEventCreateWithoutSourceInput = {
    id?: string
    startTime?: Date | string
    endTime?: Date | string | null
    status: string
    itemsFound?: number
    itemsNew?: number
    errors?: string | null
  }

  export type CrawlEventUncheckedCreateWithoutSourceInput = {
    id?: string
    startTime?: Date | string
    endTime?: Date | string | null
    status: string
    itemsFound?: number
    itemsNew?: number
    errors?: string | null
  }

  export type CrawlEventCreateOrConnectWithoutSourceInput = {
    where: CrawlEventWhereUniqueInput
    create: XOR<CrawlEventCreateWithoutSourceInput, CrawlEventUncheckedCreateWithoutSourceInput>
  }

  export type CrawlEventCreateManySourceInputEnvelope = {
    data: CrawlEventCreateManySourceInput | CrawlEventCreateManySourceInput[]
  }

  export type SourceSnapshotUpsertWithWhereUniqueWithoutSourceInput = {
    where: SourceSnapshotWhereUniqueInput
    update: XOR<SourceSnapshotUpdateWithoutSourceInput, SourceSnapshotUncheckedUpdateWithoutSourceInput>
    create: XOR<SourceSnapshotCreateWithoutSourceInput, SourceSnapshotUncheckedCreateWithoutSourceInput>
  }

  export type SourceSnapshotUpdateWithWhereUniqueWithoutSourceInput = {
    where: SourceSnapshotWhereUniqueInput
    data: XOR<SourceSnapshotUpdateWithoutSourceInput, SourceSnapshotUncheckedUpdateWithoutSourceInput>
  }

  export type SourceSnapshotUpdateManyWithWhereWithoutSourceInput = {
    where: SourceSnapshotScalarWhereInput
    data: XOR<SourceSnapshotUpdateManyMutationInput, SourceSnapshotUncheckedUpdateManyWithoutSourceInput>
  }

  export type SourceSnapshotScalarWhereInput = {
    AND?: SourceSnapshotScalarWhereInput | SourceSnapshotScalarWhereInput[]
    OR?: SourceSnapshotScalarWhereInput[]
    NOT?: SourceSnapshotScalarWhereInput | SourceSnapshotScalarWhereInput[]
    id?: StringFilter<"SourceSnapshot"> | string
    sourceId?: StringFilter<"SourceSnapshot"> | string
    externalId?: StringFilter<"SourceSnapshot"> | string
    url?: StringFilter<"SourceSnapshot"> | string
    fetchedAt?: DateTimeFilter<"SourceSnapshot"> | Date | string
    rawHtml?: StringNullableFilter<"SourceSnapshot"> | string | null
    rawJson?: StringNullableFilter<"SourceSnapshot"> | string | null
    contentHash?: StringFilter<"SourceSnapshot"> | string
    imagesEnriched?: BoolFilter<"SourceSnapshot"> | boolean
    enrichedAt?: DateTimeNullableFilter<"SourceSnapshot"> | Date | string | null
    enrichmentError?: StringNullableFilter<"SourceSnapshot"> | string | null
  }

  export type CrawlEventUpsertWithWhereUniqueWithoutSourceInput = {
    where: CrawlEventWhereUniqueInput
    update: XOR<CrawlEventUpdateWithoutSourceInput, CrawlEventUncheckedUpdateWithoutSourceInput>
    create: XOR<CrawlEventCreateWithoutSourceInput, CrawlEventUncheckedCreateWithoutSourceInput>
  }

  export type CrawlEventUpdateWithWhereUniqueWithoutSourceInput = {
    where: CrawlEventWhereUniqueInput
    data: XOR<CrawlEventUpdateWithoutSourceInput, CrawlEventUncheckedUpdateWithoutSourceInput>
  }

  export type CrawlEventUpdateManyWithWhereWithoutSourceInput = {
    where: CrawlEventScalarWhereInput
    data: XOR<CrawlEventUpdateManyMutationInput, CrawlEventUncheckedUpdateManyWithoutSourceInput>
  }

  export type CrawlEventScalarWhereInput = {
    AND?: CrawlEventScalarWhereInput | CrawlEventScalarWhereInput[]
    OR?: CrawlEventScalarWhereInput[]
    NOT?: CrawlEventScalarWhereInput | CrawlEventScalarWhereInput[]
    id?: StringFilter<"CrawlEvent"> | string
    sourceId?: StringFilter<"CrawlEvent"> | string
    startTime?: DateTimeFilter<"CrawlEvent"> | Date | string
    endTime?: DateTimeNullableFilter<"CrawlEvent"> | Date | string | null
    status?: StringFilter<"CrawlEvent"> | string
    itemsFound?: IntFilter<"CrawlEvent"> | number
    itemsNew?: IntFilter<"CrawlEvent"> | number
    errors?: StringNullableFilter<"CrawlEvent"> | string | null
  }

  export type SourceProfileCreateWithoutCrawlEventsInput = {
    id?: string
    name: string
    type: string
    baseUrl: string
    trustScore?: number
    isEnabled?: boolean
    config: string
    createdAt?: Date | string
    updatedAt?: Date | string
    snapshots?: SourceSnapshotCreateNestedManyWithoutSourceInput
  }

  export type SourceProfileUncheckedCreateWithoutCrawlEventsInput = {
    id?: string
    name: string
    type: string
    baseUrl: string
    trustScore?: number
    isEnabled?: boolean
    config: string
    createdAt?: Date | string
    updatedAt?: Date | string
    snapshots?: SourceSnapshotUncheckedCreateNestedManyWithoutSourceInput
  }

  export type SourceProfileCreateOrConnectWithoutCrawlEventsInput = {
    where: SourceProfileWhereUniqueInput
    create: XOR<SourceProfileCreateWithoutCrawlEventsInput, SourceProfileUncheckedCreateWithoutCrawlEventsInput>
  }

  export type SourceProfileUpsertWithoutCrawlEventsInput = {
    update: XOR<SourceProfileUpdateWithoutCrawlEventsInput, SourceProfileUncheckedUpdateWithoutCrawlEventsInput>
    create: XOR<SourceProfileCreateWithoutCrawlEventsInput, SourceProfileUncheckedCreateWithoutCrawlEventsInput>
    where?: SourceProfileWhereInput
  }

  export type SourceProfileUpdateToOneWithWhereWithoutCrawlEventsInput = {
    where?: SourceProfileWhereInput
    data: XOR<SourceProfileUpdateWithoutCrawlEventsInput, SourceProfileUncheckedUpdateWithoutCrawlEventsInput>
  }

  export type SourceProfileUpdateWithoutCrawlEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshots?: SourceSnapshotUpdateManyWithoutSourceNestedInput
  }

  export type SourceProfileUncheckedUpdateWithoutCrawlEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshots?: SourceSnapshotUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type SourceProfileCreateWithoutSnapshotsInput = {
    id?: string
    name: string
    type: string
    baseUrl: string
    trustScore?: number
    isEnabled?: boolean
    config: string
    createdAt?: Date | string
    updatedAt?: Date | string
    crawlEvents?: CrawlEventCreateNestedManyWithoutSourceInput
  }

  export type SourceProfileUncheckedCreateWithoutSnapshotsInput = {
    id?: string
    name: string
    type: string
    baseUrl: string
    trustScore?: number
    isEnabled?: boolean
    config: string
    createdAt?: Date | string
    updatedAt?: Date | string
    crawlEvents?: CrawlEventUncheckedCreateNestedManyWithoutSourceInput
  }

  export type SourceProfileCreateOrConnectWithoutSnapshotsInput = {
    where: SourceProfileWhereUniqueInput
    create: XOR<SourceProfileCreateWithoutSnapshotsInput, SourceProfileUncheckedCreateWithoutSnapshotsInput>
  }

  export type ObservedListingCreateWithoutSnapshotInput = {
    id?: string
    title?: string | null
    description?: string | null
    price?: number | null
    currency?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    lat?: number | null
    lng?: number | null
    status?: string | null
    listedAt?: Date | string | null
    geoHash?: string | null
    addressHash?: string | null
    mediaHash?: string | null
    confidenceScore?: number
    createdAt?: Date | string
    signals?: SignalCreateNestedManyWithoutObservedListingInput
  }

  export type ObservedListingUncheckedCreateWithoutSnapshotInput = {
    id?: string
    title?: string | null
    description?: string | null
    price?: number | null
    currency?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    lat?: number | null
    lng?: number | null
    status?: string | null
    listedAt?: Date | string | null
    geoHash?: string | null
    addressHash?: string | null
    mediaHash?: string | null
    confidenceScore?: number
    createdAt?: Date | string
    signals?: SignalUncheckedCreateNestedManyWithoutObservedListingInput
  }

  export type ObservedListingCreateOrConnectWithoutSnapshotInput = {
    where: ObservedListingWhereUniqueInput
    create: XOR<ObservedListingCreateWithoutSnapshotInput, ObservedListingUncheckedCreateWithoutSnapshotInput>
  }

  export type SourceProfileUpsertWithoutSnapshotsInput = {
    update: XOR<SourceProfileUpdateWithoutSnapshotsInput, SourceProfileUncheckedUpdateWithoutSnapshotsInput>
    create: XOR<SourceProfileCreateWithoutSnapshotsInput, SourceProfileUncheckedCreateWithoutSnapshotsInput>
    where?: SourceProfileWhereInput
  }

  export type SourceProfileUpdateToOneWithWhereWithoutSnapshotsInput = {
    where?: SourceProfileWhereInput
    data: XOR<SourceProfileUpdateWithoutSnapshotsInput, SourceProfileUncheckedUpdateWithoutSnapshotsInput>
  }

  export type SourceProfileUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crawlEvents?: CrawlEventUpdateManyWithoutSourceNestedInput
  }

  export type SourceProfileUncheckedUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    baseUrl?: StringFieldUpdateOperationsInput | string
    trustScore?: IntFieldUpdateOperationsInput | number
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    config?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    crawlEvents?: CrawlEventUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type ObservedListingUpsertWithoutSnapshotInput = {
    update: XOR<ObservedListingUpdateWithoutSnapshotInput, ObservedListingUncheckedUpdateWithoutSnapshotInput>
    create: XOR<ObservedListingCreateWithoutSnapshotInput, ObservedListingUncheckedCreateWithoutSnapshotInput>
    where?: ObservedListingWhereInput
  }

  export type ObservedListingUpdateToOneWithWhereWithoutSnapshotInput = {
    where?: ObservedListingWhereInput
    data: XOR<ObservedListingUpdateWithoutSnapshotInput, ObservedListingUncheckedUpdateWithoutSnapshotInput>
  }

  export type ObservedListingUpdateWithoutSnapshotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signals?: SignalUpdateManyWithoutObservedListingNestedInput
  }

  export type ObservedListingUncheckedUpdateWithoutSnapshotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signals?: SignalUncheckedUpdateManyWithoutObservedListingNestedInput
  }

  export type SourceSnapshotCreateWithoutObservedListingInput = {
    id?: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
    source: SourceProfileCreateNestedOneWithoutSnapshotsInput
  }

  export type SourceSnapshotUncheckedCreateWithoutObservedListingInput = {
    id?: string
    sourceId: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
  }

  export type SourceSnapshotCreateOrConnectWithoutObservedListingInput = {
    where: SourceSnapshotWhereUniqueInput
    create: XOR<SourceSnapshotCreateWithoutObservedListingInput, SourceSnapshotUncheckedCreateWithoutObservedListingInput>
  }

  export type SignalCreateWithoutObservedListingInput = {
    id?: string
    type: string
    severity: string
    matchedListingId?: string | null
    payload: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalUncheckedCreateWithoutObservedListingInput = {
    id?: string
    type: string
    severity: string
    matchedListingId?: string | null
    payload: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalCreateOrConnectWithoutObservedListingInput = {
    where: SignalWhereUniqueInput
    create: XOR<SignalCreateWithoutObservedListingInput, SignalUncheckedCreateWithoutObservedListingInput>
  }

  export type SignalCreateManyObservedListingInputEnvelope = {
    data: SignalCreateManyObservedListingInput | SignalCreateManyObservedListingInput[]
  }

  export type SourceSnapshotUpsertWithoutObservedListingInput = {
    update: XOR<SourceSnapshotUpdateWithoutObservedListingInput, SourceSnapshotUncheckedUpdateWithoutObservedListingInput>
    create: XOR<SourceSnapshotCreateWithoutObservedListingInput, SourceSnapshotUncheckedCreateWithoutObservedListingInput>
    where?: SourceSnapshotWhereInput
  }

  export type SourceSnapshotUpdateToOneWithWhereWithoutObservedListingInput = {
    where?: SourceSnapshotWhereInput
    data: XOR<SourceSnapshotUpdateWithoutObservedListingInput, SourceSnapshotUncheckedUpdateWithoutObservedListingInput>
  }

  export type SourceSnapshotUpdateWithoutObservedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
    source?: SourceProfileUpdateOneRequiredWithoutSnapshotsNestedInput
  }

  export type SourceSnapshotUncheckedUpdateWithoutObservedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SignalUpsertWithWhereUniqueWithoutObservedListingInput = {
    where: SignalWhereUniqueInput
    update: XOR<SignalUpdateWithoutObservedListingInput, SignalUncheckedUpdateWithoutObservedListingInput>
    create: XOR<SignalCreateWithoutObservedListingInput, SignalUncheckedCreateWithoutObservedListingInput>
  }

  export type SignalUpdateWithWhereUniqueWithoutObservedListingInput = {
    where: SignalWhereUniqueInput
    data: XOR<SignalUpdateWithoutObservedListingInput, SignalUncheckedUpdateWithoutObservedListingInput>
  }

  export type SignalUpdateManyWithWhereWithoutObservedListingInput = {
    where: SignalScalarWhereInput
    data: XOR<SignalUpdateManyMutationInput, SignalUncheckedUpdateManyWithoutObservedListingInput>
  }

  export type SignalScalarWhereInput = {
    AND?: SignalScalarWhereInput | SignalScalarWhereInput[]
    OR?: SignalScalarWhereInput[]
    NOT?: SignalScalarWhereInput | SignalScalarWhereInput[]
    id?: StringFilter<"Signal"> | string
    type?: StringFilter<"Signal"> | string
    severity?: StringFilter<"Signal"> | string
    observedListingId?: StringFilter<"Signal"> | string
    matchedListingId?: StringNullableFilter<"Signal"> | string | null
    payload?: StringFilter<"Signal"> | string
    status?: StringFilter<"Signal"> | string
    createdAt?: DateTimeFilter<"Signal"> | Date | string
    updatedAt?: DateTimeFilter<"Signal"> | Date | string
  }

  export type ObservedListingCreateWithoutSignalsInput = {
    id?: string
    title?: string | null
    description?: string | null
    price?: number | null
    currency?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    lat?: number | null
    lng?: number | null
    status?: string | null
    listedAt?: Date | string | null
    geoHash?: string | null
    addressHash?: string | null
    mediaHash?: string | null
    confidenceScore?: number
    createdAt?: Date | string
    snapshot: SourceSnapshotCreateNestedOneWithoutObservedListingInput
  }

  export type ObservedListingUncheckedCreateWithoutSignalsInput = {
    id?: string
    snapshotId: string
    title?: string | null
    description?: string | null
    price?: number | null
    currency?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    lat?: number | null
    lng?: number | null
    status?: string | null
    listedAt?: Date | string | null
    geoHash?: string | null
    addressHash?: string | null
    mediaHash?: string | null
    confidenceScore?: number
    createdAt?: Date | string
  }

  export type ObservedListingCreateOrConnectWithoutSignalsInput = {
    where: ObservedListingWhereUniqueInput
    create: XOR<ObservedListingCreateWithoutSignalsInput, ObservedListingUncheckedCreateWithoutSignalsInput>
  }

  export type ObservedListingUpsertWithoutSignalsInput = {
    update: XOR<ObservedListingUpdateWithoutSignalsInput, ObservedListingUncheckedUpdateWithoutSignalsInput>
    create: XOR<ObservedListingCreateWithoutSignalsInput, ObservedListingUncheckedCreateWithoutSignalsInput>
    where?: ObservedListingWhereInput
  }

  export type ObservedListingUpdateToOneWithWhereWithoutSignalsInput = {
    where?: ObservedListingWhereInput
    data: XOR<ObservedListingUpdateWithoutSignalsInput, ObservedListingUncheckedUpdateWithoutSignalsInput>
  }

  export type ObservedListingUpdateWithoutSignalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshot?: SourceSnapshotUpdateOneRequiredWithoutObservedListingNestedInput
  }

  export type ObservedListingUncheckedUpdateWithoutSignalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    listedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    geoHash?: NullableStringFieldUpdateOperationsInput | string | null
    addressHash?: NullableStringFieldUpdateOperationsInput | string | null
    mediaHash?: NullableStringFieldUpdateOperationsInput | string | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceSnapshotCreateManySourceInput = {
    id?: string
    externalId: string
    url: string
    fetchedAt?: Date | string
    rawHtml?: string | null
    rawJson?: string | null
    contentHash: string
    imagesEnriched?: boolean
    enrichedAt?: Date | string | null
    enrichmentError?: string | null
  }

  export type CrawlEventCreateManySourceInput = {
    id?: string
    startTime?: Date | string
    endTime?: Date | string | null
    status: string
    itemsFound?: number
    itemsNew?: number
    errors?: string | null
  }

  export type SourceSnapshotUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
    observedListing?: ObservedListingUpdateOneWithoutSnapshotNestedInput
  }

  export type SourceSnapshotUncheckedUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
    observedListing?: ObservedListingUncheckedUpdateOneWithoutSnapshotNestedInput
  }

  export type SourceSnapshotUncheckedUpdateManyWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawHtml?: NullableStringFieldUpdateOperationsInput | string | null
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: StringFieldUpdateOperationsInput | string
    imagesEnriched?: BoolFieldUpdateOperationsInput | boolean
    enrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    enrichmentError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CrawlEventUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    itemsFound?: IntFieldUpdateOperationsInput | number
    itemsNew?: IntFieldUpdateOperationsInput | number
    errors?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CrawlEventUncheckedUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    itemsFound?: IntFieldUpdateOperationsInput | number
    itemsNew?: IntFieldUpdateOperationsInput | number
    errors?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CrawlEventUncheckedUpdateManyWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    itemsFound?: IntFieldUpdateOperationsInput | number
    itemsNew?: IntFieldUpdateOperationsInput | number
    errors?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SignalCreateManyObservedListingInput = {
    id?: string
    type: string
    severity: string
    matchedListingId?: string | null
    payload: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalUpdateWithoutObservedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    matchedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalUncheckedUpdateWithoutObservedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    matchedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalUncheckedUpdateManyWithoutObservedListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    matchedListingId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}