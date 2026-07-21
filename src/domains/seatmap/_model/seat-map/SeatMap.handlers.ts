/**
 * @fileoverview Error handlers for SeatMap model operations.
 */

import type {ZodIssue} from "zod";
import {ZodDuplicateIndexError} from "@/shared/errors/zod/ZodDuplicateIndexError";
import {SeatMap} from "@/domains/seatmap/_model/seat-map/SeatMap.model";

/** Handles MongoDB duplicate key errors by transforming them into formatted ZodDuplicateIndexErrors. */
export function handleDuplicateIndex(indexString: string): void | never {
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

        throw new ZodDuplicateIndexError({
            index: indexString,
            model: SeatMap.modelName,
            errors,
            message: "Duplicate seat mapping detected. Each seat can be assigned only once per showing.",
        });
    }
}