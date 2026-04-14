/**
 * @fileoverview Error handlers for the Genre domain.
 * Maps low-level database index violations to user-friendly Zod errors.
 */

import type {ZodIssue} from "zod";
import {ZodDuplicateIndexError} from "@shared/errors/zod/ZodDuplicateIndexError";
import {Genre} from "@domains/genre/models/genre/Genre.model";

/**
 * Handles unique constraint violations for Genres.
 * @throws {ZodDuplicateIndexError} With a mapped error path and message.
 */
export function handleGenreDuplicateIndex(indexString: string): void | never {
    if (indexString === "name_1") {
        const errors: ZodIssue[] = [
            {
                path: ["name"],
                code: "custom",
                message: "A genre with this name already exists."
            }
        ];

        throw new ZodDuplicateIndexError({
            index: indexString,
            model: Genre.modelName,
            errors,
            message: "Duplicate genre name detected."
        });
    }
}