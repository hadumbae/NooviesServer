import type { ZodIssue } from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

/**
 * Creates a {@link ZodParseError} describing duplicate seat conflicts
 * at the **row level**.
 *
 * This helper is used to enforce that each seat within a theatre
 * is uniquely identified by its theatre, screen, row, and seat number.
 * When a duplicate seat is detected (based on a known `indexString`),
 * a structured {@link ZodParseError} is returned containing field-specific
 * validation issues for:
 *
 * - **theatre** – Seats in this theatre already exist.
 * - **screen** – Seats on this screen already exist.
 * - **row** – This row already has seats.
 *
 * @param indexString - A unique identifier string for a seat, typically
 *   encoding its theatre, screen, row, and seat number
 *   (e.g. `"theatre_1_screen_1_row_1_seatNumber_1"`).
 * @returns A {@link ZodParseError} if the seat is a duplicate, otherwise `undefined`.
 *
 * @example
 * ```ts
 * const error = createSeatsByRowDuplicateError("theatre_1_screen_1_row_1_seatNumber_1");
 * if (error) {
 *   console.error(error.message);
 *   // => "Duplicate seat detected: theatre, screen, row, and seat number must form a unique combination."
 * }
 * ```
 */
export default function createSeatsByRowDuplicateError(indexString: string) {
    if (indexString === "theatre_1_screen_1_row_1_seatNumber_1") {
        const errors: ZodIssue[] = [
            {
                path: ["theatre"],
                code: "custom",
                message: "Seats in this theatre already exists.",
            },
            {
                path: ["screen"],
                code: "custom",
                message: "Seats on this screen already exists.",
            },
            {
                path: ["row"],
                code: "custom",
                message: "This row already has seats.",
            },
        ];

        return new ZodParseError({
            errors,
            message:
                "Duplicate seat detected: theatre, screen, row, and seat number must form a unique combination.",
        });
    }
}
