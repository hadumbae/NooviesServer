import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type IGenre from "../model/Genre.interface.js";
import type { ZodIssue } from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

/**
 * Repository for managing {@link IGenre} documents.
 *
 * Extends the generic {@link BaseRepository} to provide
 * model-specific error handling and validation for genres.
 *
 * Handles CRUD operations and unique constraint enforcement
 * for genre names.
 *
 * ## Unique Constraints
 * - `name` must be unique across all genres.
 */
export default class GenreRepository extends BaseRepository<IGenre> {

    /**
     * Throws a structured `ZodParseError` when a unique index constraint is violated.
     *
     * Converts MongoDB duplicate key errors into field-level Zod issues
     * with actionable messages.
     *
     * ## Handled Index
     * - `name_1` → Prevents duplicate genre names.
     *
     * @param indexString - The name of the MongoDB index that was violated.
     * @throws {ZodParseError} Contains field-level errors and a top-level message
     * explaining the duplicate and how to fix it.
     *
     * @example
     * ```ts
     * try {
     *   await genreRepo.create({ data: { name: "Comedy" } });
     * } catch (error) {
     *   if (error instanceof ZodParseError) {
     *     console.log(error.errors); // field-specific messages
     *     console.log(error.message); // top-level guidance
     *   }
     * }
     * ```
     */
    protected throwDuplicateError(indexString: string) {
        console.debug("Genre Repository Duplicate Index: ", indexString);

        if (indexString === "name_1") {
            const errors: ZodIssue[] = [
                {
                    path: ["name"],
                    code: "custom",
                    message: "A genre with this name already exists. Please choose a different name."
                }
            ];

            throw new ZodParseError({
                errors,
                message: "Duplicate genre detected. Each genre name must be unique."
            });
        }
    }
}
