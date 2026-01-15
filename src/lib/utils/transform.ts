type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

type KeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnakeCase<K & string>]: T[K] extends object
    ? KeysToSnakeCase<T[K]>
    : T[K];
};

type KeysToCamelCase<T> = {
  [K in keyof T as SnakeToCamelCase<K & string>]: T[K] extends object
    ? KeysToCamelCase<T[K]>
    : T[K];
};

export function toSnakeCase<T extends Record<string, unknown>>(
  obj: T
): KeysToSnakeCase<T> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    const value = obj[key];
    result[snakeKey] =
      value && typeof value === "object" && !Array.isArray(value)
        ? toSnakeCase(value as Record<string, unknown>)
        : value;
  }
  return result as KeysToSnakeCase<T>;
}

export function toCamelCase<T extends Record<string, unknown>>(
  obj: T
): KeysToCamelCase<T> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = obj[key];
    result[camelKey] =
      value && typeof value === "object" && !Array.isArray(value)
        ? toCamelCase(value as Record<string, unknown>)
        : value;
  }
  return result as KeysToCamelCase<T>;
}

