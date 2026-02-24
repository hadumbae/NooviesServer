/**
 * @file Duplicate index error utility.
 * isDuplicateIndexError.ts
 */

/**
 * Determines whether an error is a MongoDB duplicate index violation.
 */
export function isDuplicateIndexError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    );
}