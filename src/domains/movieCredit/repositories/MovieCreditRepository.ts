import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type {IMovieCredit} from "../models/MovieCredit.interface.js";
import type {ZodIssue} from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

/**
 * Repository for managing {@link IMovieCredit} documents.
 *
 * Extends the generic {@link BaseRepository} to provide
 * model-specific error handling and validation for movie credits.
 *
 * Handles CRUD, pagination, and unique constraint enforcement
 * for cast and crew credits in movies.
 *
 * ## Unique Constraints
 * - CAST billing order must be unique per movie.
 * - CAST credits must be unique per `(movie, person, roleType, characterName)`.
 * - CREW credits must be unique per `(movie, person, roleType, displayRoleName)`.
 */
export default class MovieCreditRepository extends BaseRepository<IMovieCredit> {

    /**
     * Throws a structured `ZodParseError` when a unique index constraint is violated.
     *
     * Converts MongoDB duplicate key errors into field-level Zod issues
     * with actionable messages for both CAST and CREW credits.
     *
     * ## Handled Indexes
     * - `movie_1_billingOrder_1` → CAST billing order uniqueness.
     * - `movie_1_person_1_roleType_1_characterName_1` → CAST credit uniqueness.
     * - `movie_1_person_1_roleType_1_displayRoleName_1` → CREW credit uniqueness.
     *
     * @param indexString - The name of the MongoDB index that was violated.
     * @throws {ZodParseError} Contains field-level errors and a top-level message
     * explaining the duplicate and how to fix it.
     *
     * @example
     * ```ts
     * try {
     *   await movieCreditRepo.create({
     *     data: {
     *       movie: movieId,
     *       person: personId,
     *       department: "CAST",
     *       roleType: roleTypeId,
     *       characterName: "John Doe",
     *       billingOrder: 1
     *     }
     *   });
     * } catch (error) {
     *   if (error instanceof ZodParseError) {
     *     console.log(error.errors); // field-specific messages
     *     console.log(error.message); // top-level guidance
     *   }
     * }
     * ```
     */
    protected throwDuplicateError(indexString: string) {
        console.debug("Movie Credit Repository Duplicate Index: ", indexString);

        if (indexString === "movie_1_billingOrder_1") {
            const errors: ZodIssue[] = [
                {
                    path: ["movie"],
                    code: "custom",
                    message: "This movie already has a cast member assigned to this billing order."
                },
                {
                    path: ["billingOrder"],
                    code: "custom",
                    message: "Billing order must be unique within a movie’s cast list."
                },
            ];

            throw new ZodParseError({
                errors,
                message: "Duplicate billing order detected. Each cast member in a movie must have a unique billing order."
            });

        } else if (indexString === "movie_1_person_1_roleType_1_characterName_1") {
            const errors: ZodIssue[] = [
                {path: ["movie"], code: "custom", message: "This movie already includes this person in the cast."},
                {
                    path: ["person"],
                    code: "custom",
                    message: "This person is already credited with this character in the movie."
                },
                {
                    path: ["roleType"],
                    code: "custom",
                    message: "This person is already assigned to this role type for the movie."
                },
                {
                    path: ["characterName"],
                    code: "custom",
                    message: "This character is already associated with this actor in the movie."
                },
            ];

            throw new ZodParseError({
                errors,
                message: "Duplicate cast entry detected. A person cannot be credited with the same role and character more than once in a movie."
            });

        } else if (indexString === "movie_1_person_1_roleType_1_displayRoleName_1") {
            const errors: ZodIssue[] = [
                {path: ["movie"], code: "custom", message: "This movie already includes this person in the crew."},
                {
                    path: ["person"],
                    code: "custom",
                    message: "This person is already credited in this role for the movie."
                },
                {
                    path: ["roleType"],
                    code: "custom",
                    message: "This person is already assigned to this role type in the movie."
                },
                {
                    path: ["displayRoleName"],
                    code: "custom",
                    message: "This display role name is already assigned for this crew member in the movie."
                },
            ];

            throw new ZodParseError({
                errors,
                message: "Duplicate crew entry detected. A person cannot be credited with the same role and display role more than once in a movie."
            });
        }
    }
}
