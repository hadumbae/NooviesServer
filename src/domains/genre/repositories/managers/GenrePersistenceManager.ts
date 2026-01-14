import {PersistenceManager} from "../../../../shared/repository/managers/PersistenceManager.js";
import type {PersistenceManagerMethods} from "../../../../shared/repository/managers/PersistenceManager.types.js";
import type {ZodIssue} from "zod";
import Genre from "../../model/Genre.model.js";
import {ZodDuplicateIndexError} from "../../../../shared/errors/zod/ZodDuplicateIndexError.js";

/**
 * Persistence manager for {@link Genre} entities.
 *
 * Extends the base {@link PersistenceManager} to translate
 * database-level duplicate index violations into structured
 * Zod validation errors.
 */
export class GenrePersistenceManager extends PersistenceManager implements PersistenceManagerMethods {
    /**
     * Creates a new {@link GenrePersistenceManager}.
     *
     * Registers the Genre model name for persistence error handling.
     */
    constructor() {
        super({modelName: Genre.modelName});
    }

    /**
     * Checks a MongoDB duplicate index string and throws a mapped
     * {@link ZodDuplicateIndexError} when a known constraint is violated.
     *
     * @param indexString - Raw index identifier returned by MongoDB.
     *
     * @throws {ZodDuplicateIndexError}
     * Thrown when the `name_1` unique index is violated.
     */
    checkDuplicateIndexString(indexString: string) {
        if (indexString === "name_1") {
            const errors: ZodIssue[] = [
                {
                    path: ["name"],
                    code: "custom",
                    message: "A genre with this name already exists. Please choose a different name."
                }
            ];

            throw new ZodDuplicateIndexError({
                index: indexString,
                model: this.modelName,
                errors,
                message: "Duplicate genre detected. Each genre name must be unique."
            });
        }
    }
}
