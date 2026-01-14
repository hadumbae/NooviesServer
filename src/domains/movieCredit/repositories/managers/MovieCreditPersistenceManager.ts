import {PersistenceManager} from "../../../../shared/repository/managers/PersistenceManager.js";
import type {PersistenceManagerMethods} from "../../../../shared/repository/managers/PersistenceManager.types.js";
import MovieCreditModel from "../../models/MovieCredit.model.js";
import type {ZodIssue} from "zod";
import {ZodDuplicateIndexError} from "../../../../shared/errors/zod/ZodDuplicateIndexError.js";

/**
 * @file MovieCreditPersistenceManager.ts
 *
 * Persistence manager for the MovieCredit domain.
 *
 * Translates MongoDB duplicate index errors into structured,
 * domain-specific validation errors.
 */

/**
 * MovieCredit-specific persistence manager.
 *
 * Handles compound uniqueness constraints for cast and crew credits,
 * ensuring database errors surface as meaningful validation feedback.
 */
export class MovieCreditPersistenceManager
    extends PersistenceManager
    implements PersistenceManagerMethods
{
    constructor() {
        super({modelName: MovieCreditModel.modelName});
    }

    /**
     * Normalizes MongoDB duplicate index errors.
     *
     * Maps known compound index violations to {@link ZodDuplicateIndexError}
     * instances with field-level validation messages.
     *
     * @param error - Raw persistence-layer error
     * @throws {ZodDuplicateIndexError} For uniqueness violations
     */
    checkDuplicateIndexError(error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            const indexName =
                (error as any).errmsg.match(/index: (\S+)/)?.[1];

            if (indexName === "movie_1_billingOrder_1") {
                const errors: ZodIssue[] = [
                    {
                        path: ["movie"],
                        code: "custom",
                        message: "This movie already has a cast member assigned to this billing order.",
                    },
                    {
                        path: ["billingOrder"],
                        code: "custom",
                        message: "Billing order must be unique within a movie’s cast list.",
                    },
                ];

                throw new ZodDuplicateIndexError({
                    model: this.modelName,
                    index: indexName,
                    errors,
                    message: "Duplicate billing order detected. Each cast member in a movie must have a unique billing order.",
                });

            } else if (indexName === "movie_1_person_1_roleType_1_characterName_1") {
                const errors: ZodIssue[] = [
                    {path: ["movie"], code: "custom", message: "This movie already includes this person in the cast."},
                    {
                        path: ["person"],
                        code: "custom",
                        message: "This person is already credited with this character in the movie.",
                    },
                    {
                        path: ["roleType"],
                        code: "custom",
                        message: "This person is already assigned to this role type for the movie.",
                    },
                    {
                        path: ["characterName"],
                        code: "custom",
                        message: "This character is already associated with this actor in the movie.",
                    },
                ];

                throw new ZodDuplicateIndexError({
                    model: this.modelName,
                    index: indexName,
                    errors,
                    message: "Duplicate cast entry detected. A person cannot be credited with the same role and character more than once in a movie.",
                });

            } else if (indexName === "movie_1_person_1_roleType_1_displayRoleName_1") {
                const errors: ZodIssue[] = [
                    {path: ["movie"], code: "custom", message: "This movie already includes this person in the crew."},
                    {
                        path: ["person"],
                        code: "custom",
                        message: "This person is already credited in this role for the movie.",
                    },
                    {
                        path: ["roleType"],
                        code: "custom",
                        message: "This person is already assigned to this role type in the movie.",
                    },
                    {
                        path: ["displayRoleName"],
                        code: "custom",
                        message: "This display role name is already assigned for this crew member in the movie.",
                    },
                ];

                throw new ZodDuplicateIndexError({
                    model: this.modelName,
                    index: indexName,
                    errors,
                    message: "Duplicate crew entry detected. A person cannot be credited with the same role and display role more than once in a movie.",
                });
            }

            throw new ZodDuplicateIndexError({
                model: this.modelName,
                index: indexName,
                errors: [],
                message: `Duplicate index violation: ${indexName}`,
            });
        }
    }
}
