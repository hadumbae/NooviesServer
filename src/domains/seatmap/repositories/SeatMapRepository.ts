import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type ISeatMap from "../model/SeatMap.interface.js";
import type {ZodIssue} from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import SeatMap from "../model/SeatMap.model.js";

type SeatMapRepositoryConstructorParams = {
    /** Optional array of reference paths to populate when fetching documents */
    readonly populateRefs?: PopulatePath[];
}

/**
 * Repository class responsible for managing persistence operations
 * for {@link ISeatMap} entities.
 *
 * @remarks
 * Extends the generic {@link BaseRepository} to provide
 * seat-map–specific behavior, including custom duplicate-key
 * error handling for the unique `(showing, seat)` compound index.
 *
 * The repository ensures that each seat can only be mapped once
 * for a given showing. When MongoDB reports a duplicate index violation,
 * this class translates it into a `ZodParseError` for consistent
 * domain-level error handling across the application.
 *
 * @example
 * ```ts
 * const repo = new SeatMapRepository(SeatMapModel);
 *
 * try {
 *   await repo.create({ ... });
 * } catch (err) {
 *   if (err instanceof ZodParseError) {
 *     // handle structured Zod errors in UI or API response
 *   }
 * }
 * ```
 */
export default class SeatMapRepository extends BaseRepository<ISeatMap> {
    constructor({populateRefs}: SeatMapRepositoryConstructorParams) {
        super({model: SeatMap, populateRefs});
    }

    /**
     * Converts a MongoDB duplicate index error into
     * a domain-specific `ZodParseError`.
     *
     * @param indexString - The index name reported by MongoDB.
     * Expected to match `"showing_1_seat_1"` when the `(showing, seat)`
     * compound unique constraint is violated.
     *
     * @throws ZodParseError
     * If the index corresponds to the seat-mapping uniqueness rule.
     *
     * @example
     * ```ts
     * repo.throwDuplicateError("showing_1_seat_1");
     * ```
     */
    protected throwDuplicateError(indexString: string) {
        console.debug("Seat Map Repository Duplicate Index: ", indexString);

        if (indexString === "showing_1_seat_1") {
            const errors: ZodIssue[] = [
                {
                    path: ["showing"],
                    code: "custom",
                    message: "This showing already contains this seat."
                },
                {
                    path: ["seat"],
                    code: "custom",
                    message: "A seat cannot be mapped more than once within the same showing."
                },
            ];

            throw new ZodParseError({
                errors,
                message: "Duplicate seat mapping detected. Each seat can be assigned only once per showing."
            });
        }
    }
}
