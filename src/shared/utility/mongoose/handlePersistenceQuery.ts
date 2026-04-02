/**
 * @file Wraps persistence queries with retry and duplicate index handling.
 * handlePersistenceQuery.ts
 */

import {isDuplicateIndexError} from "./isDuplicateIndexError.js";
import {handleDuplicateIndexError} from "./handleDuplicateIndexError.js";
import {isMongooseVersionError} from "./isMongooseVersionError.js";

/**
 * Configuration for executing a persistence query with retry and
 * duplicate index error mapping.
 *
 * @typeParam TReturn - The resolved type of the query promise.
 */
type QueryParams<TReturn> = {
    /** Function that performs the persistence operation. */
    query: () => Promise<TReturn>;
    /** Optional model name used for error context. */
    modelName?: string;
    /** Number of retry attempts on version conflict. */
    retries?: number;
    /** Optional handler for mapping duplicate index identifiers. */
    onDuplicateIndexError?: (indexString: string) => void | never;
    /** Optional handler invoked when retries are exhausted. */
    onVersionError?: () => never;
}

/**
 * Executes a persistence query and retries on version conflicts
 * before delegating duplicate index errors to an optional handler.
 *
 * @param params - Query configuration.
 * @returns The query result promise.
 */
export function handlePersistenceQuery<TReturn>(params: QueryParams<TReturn>): Promise<TReturn> {
    const {query, modelName, retries = 0, onDuplicateIndexError, onVersionError} = params;

    try {
        return query();
    } catch (error: unknown) {
        if (isMongooseVersionError(error)) {
            if (retries > 0) {
                return handlePersistenceQuery({...params, retries: retries - 1});
            }
            onVersionError?.();
        }

        if (isDuplicateIndexError(error)) {
            handleDuplicateIndexError({
                error,
                modelName,
                handleIndex: onDuplicateIndexError,
            });
        }

        throw error;
    }
}