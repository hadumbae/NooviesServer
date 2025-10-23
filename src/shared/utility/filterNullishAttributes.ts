/**
 * Filters out `null` and `undefined` values from an object.
 *
 * This function returns a **shallow copy** of the input object
 * with all properties whose values are `null` or `undefined` removed.
 * Useful when you want to clean up objects before sending them
 * to a database, API, or JSON serialization.
 *
 * @template T - The type of the input object.
 * @param data - The object to filter.
 * @returns A new object containing only the properties with non-nullish values.
 *
 * @example
 * ```ts
 * const input = { name: "Alice", age: null, email: undefined };
 * const filtered = filterNullishAttributes(input);
 * console.log(filtered); // { name: "Alice" }
 * ```
 */
export default function filterNullishAttributes<T extends Record<string, any>>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null && value !== undefined),
    ) as Partial<T>;
}
