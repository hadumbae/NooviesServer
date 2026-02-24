/**
 * @file Duplicate index error handler.
 * handleDuplicateIndexError.ts
 */

import { isDuplicateIndexError } from "./isDuplicateIndexError.js";
import { ZodDuplicateIndexError } from "../../errors/zod/ZodDuplicateIndexError.js";

type ErrorParams = {
    error: unknown;
    modelName?: string;
    handleIndex?: (indexString: string) => never;
};

/**
 * Normalizes MongoDB duplicate index errors.
 */
export function handleDuplicateIndexError(
    { error, modelName, handleIndex }: ErrorParams
): never {
    const isValidError = isDuplicateIndexError(error);

    if (isValidError) {
        const indexString = (error as any).errmsg.match(/index: (\S+)/)?.[1];

        handleIndex?.(indexString);

        throw new ZodDuplicateIndexError({
            message: `Duplicate Error: ${indexString}`,
            index: indexString,
            model: modelName,
            errors: [],
        });
    }

    throw error;
}