/**
 * @file Type guard for identifying Mongoose VersionError instances.
 * isMongooseVersionError.ts
 */

/**
 * Determines whether an error is a Mongoose VersionError.
 *
 * @param error - The error to evaluate.
 * @returns True if the error represents a version conflict.
 */
export function isMongooseVersionError(error: unknown): boolean {
    return error instanceof Error && error.name === "VersionError";
}