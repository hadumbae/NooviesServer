import type { ZodIssue } from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

/**
 * Creates a {@link ZodParseError} describing duplicate seat conflicts.
 *
 * This is used to enforce that each seat within a theatre is uniquely
 * identified by its theatre, screen, row, and seat number.
 *
 * If the provided `indexString` matches a known duplicate pattern
 * (e.g. `"theatre_1_screen_1_row_1_seatNumber_1"`), a structured
 * error is returned with field-specific issues for:
 *
 * - **theatre** – A seat in this theatre already exists.
 * - **screen** – A seat on this screen already exists.
 * - **row** – This row already contains a seat with this number.
 * - **seatNumber** – This seat number is already taken in the selected row.
 *
 * @param indexString - Unique identifier string for a seat.
 * @returns A {@link ZodParseError} if the seat is a duplicate, otherwise `undefined`.
 *
 * @example
 * ```ts
 * const error = createSeatDuplicateError("theatre_1_screen_1_row_1_seatNumber_1");
 * if (error) {
 *   console.error(error.message);
 *   // => "Duplicate seat detected: theatre, screen, row, and seat number must form a unique combination."
 * }
 * ```
 */
export default function createSeatDuplicateError(indexString: string) {
    if (indexString === "theatre_1_screen_1_row_1_seatNumber_1") {
        const errors: ZodIssue[] = [
            {
                path: ["theatre"],
                code: "custom",
                message: "A seat in this theatre already exists.",
            },
            {
                path: ["screen"],
                code: "custom",
                message: "A seat on this screen already exists.",
            },
            {
                path: ["row"],
                code: "custom",
                message: "This row already contains a seat with this number.",
            },
            {
                path: ["seatNumber"],
                code: "custom",
                message: "This seat number is already taken in the selected row.",
            },
        ];

        return new ZodParseError({
            errors,
            message:
                "Duplicate seat detected: theatre, screen, row, and seat number must form a unique combination.",
        });
    }
}
