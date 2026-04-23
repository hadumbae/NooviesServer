/**
 * @fileoverview Database error handlers for Seat entity indexing constraints.
 */

import type { ZodIssue } from "zod";
import { ZodDuplicateIndexError } from "@shared/errors/zod/ZodDuplicateIndexError";
import {Seat} from "@domains/seat/model/Seat.model";

/**
 * Intercepts MongoDB duplicate key errors for Seat indexes and transforms them
 * into structured ZodDuplicateIndexErrors for consistent API error responses.
 * @throws {ZodDuplicateIndexError} structured error mapping database conflicts to form fields.
 */
export function handleDuplicateIndex(indexString: string): void | never {
    // Conflict: Natural Key (Theatre + Screen + Row + Seat Number)
    if (indexString === "theatre_1_screen_1_row_1_seatNumber_1") {
        const errors: ZodIssue[] = [
            { path: ["theatre"], code: "custom", message: "Seat in this theatre already exists." },
            { path: ["screen"], code: "custom", message: "Seat on this screen already exists." },
            { path: ["row"], code: "custom", message: "Row already has this seat number." },
            { path: ["seatNumber"], code: "custom", message: "Seat number already taken in this row." },
        ];

        throw new ZodDuplicateIndexError({
            index: indexString,
            model: Seat.modelName,
            errors,
            message: "Duplicate seat: row + seat number must be unique.",
        });
    }

    // Conflict: Spatial Key (Theatre + Screen + Coordinates)
    if (indexString === "theatre_1_screen_1_x_1_y_1") {
        const errors: ZodIssue[] = [
            { path: ["theatre"], code: "custom", message: "Seat in this theatre already exists." },
            { path: ["screen"], code: "custom", message: "Seat on this screen already exists." },
            { path: ["x"], code: "custom", message: "X coordinate already used." },
            { path: ["y"], code: "custom", message: "Y coordinate already used." },
        ];

        throw new ZodDuplicateIndexError({
            index: indexString,
            model: Seat.modelName,
            errors,
            message: "Duplicate seat: coordinates (x, y) must be unique.",
        });
    }
}