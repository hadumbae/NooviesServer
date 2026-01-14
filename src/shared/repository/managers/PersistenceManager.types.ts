/**
 * @file PersistenceManager.types.ts
 *
 * Type definitions for persistence error handling utilities.
 */

/**
 * Constructor configuration for a persistence manager.
 */
type PersistenceManagerConstructor = {
    /** Name of the backing model (used for error context). */
    modelName: string;
};

/**
 * Contract for persistence error handling methods.
 *
 * Defines a standardized interface for normalizing and
 * rethrowing persistence and retrieval errors.
 */
interface PersistenceManagerMethods {
    /**
     * Check and handle document-not-found errors.
     *
     * @param error - Thrown error
     * @param code - HTTP status code to throw
     * @param message - Error message
     */
    checkDocumentNotFoundError(
        error: unknown,
        code: number,
        message: string
    ): void;

    /**
     * Check and handle duplicate index violations.
     *
     * @param error - Thrown error
     */
    checkDuplicateIndexError(error: unknown): void;

    checkDuplicateIndexString(indexString: string): void;

    /**
     * Normalize fetch-related errors.
     *
     * @param error - Thrown error
     *
     * @throws Never returns
     */
    throwFetchError(error: unknown): never;

    /**
     * Normalize persistence-related errors.
     *
     * @param error - Thrown error
     *
     * @throws Never returns
     */
    throwPersistError(error: unknown): never;
}

export type {
    PersistenceManagerConstructor,
    PersistenceManagerMethods,
};
