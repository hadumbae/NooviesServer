/**
 * @file SeatMapPersistenceManager.ts
 *
 * SeatMap-specific persistence error handling.
 */

import {PersistenceManager} from "../../../../shared/repository/managers/PersistenceManager.js";
import type {PersistenceManagerMethods} from "../../../../shared/repository/managers/PersistenceManager.types.js";
import type {ZodIssue} from "zod";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import SeatMapModel from "../../model/SeatMap.model.js";

/**
 * Persistence manager for SeatMap.
 *
 * Translates database-level constraint violations
 * into structured validation errors.
 */
export class SeatMapPersistenceManager
    extends PersistenceManager
    implements PersistenceManagerMethods
{
    constructor() {
        super({modelName: SeatMapModel.modelName});
    }

    /**
     * Maps known duplicate index constraints to
     * user-facing Zod validation errors.
     *
     * @param indexString MongoDB index identifier
     * @throws ZodParseError
     */
    checkDuplicateIndexString(indexString: string): void {
        if (indexString === "showing_1_seat_1") {
            const errors: ZodIssue[] = [
                {
                    path: ["showing"],
                    code: "custom",
                    message: "This showing already contains this seat.",
                },
                {
                    path: ["seat"],
                    code: "custom",
                    message: "A seat cannot be mapped more than once within the same showing.",
                },
            ];

            throw new ZodParseError({
                errors,
                message:
                    "Duplicate seat mapping detected. Each seat can be assigned only once per showing.",
            });
        }
    }
}
