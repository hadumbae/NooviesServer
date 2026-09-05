/**
 * @fileoverview Utility functions for cleaning and manipulating object attributes.
 */

/** Removes null and undefined values from an object, returning a partial copy. */
export function filterNullishAttributes<TObject extends Record<string, any>>(data: TObject): Partial<TObject> {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null && value !== undefined),
    ) as Partial<TObject>;
}