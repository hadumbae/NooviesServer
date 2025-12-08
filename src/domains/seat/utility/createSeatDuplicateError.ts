import type { ZodIssue } from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

/**
 * Creates a {@link ZodParseError} for duplicate seat conflicts.
 *
 * Includes all relevant fields: theatre, screen, and either row+seatNumber or x+y.
 *
 * @param indexString - Unique identifier string for a seat.
 * @returns A {@link ZodParseError} if a duplicate exists, otherwise `undefined`.
 */
export default function createSeatDuplicateError(indexString: string) {
    console.log("Error Here!: ", indexString);

    if (indexString === "theatre_1_screen_1_row_1_seatNumber_1") {
        console.log("Same Row And Number");

        const errors: ZodIssue[] = [
            { path: ["theatre"], code: "custom", message: "Seat in this theatre already exists." },
            { path: ["screen"], code: "custom", message: "Seat on this screen already exists." },
            { path: ["row"], code: "custom", message: "Row already has this seat number." },
            { path: ["seatNumber"], code: "custom", message: "Seat number already taken in this row." },
        ];

        return new ZodParseError({
            errors,
            message: "Duplicate seat: row + seat number must be unique.",
        });
    } else if (indexString === "theatre_1_screen_1_x_1_y_1") {
        console.log("Same X And Y");

        const errors: ZodIssue[] = [
            { path: ["theatre"], code: "custom", message: "Seat in this theatre already exists." },
            { path: ["screen"], code: "custom", message: "Seat on this screen already exists." },
            { path: ["x"], code: "custom", message: "X coordinate already used." },
            { path: ["y"], code: "custom", message: "Y coordinate already used." },
        ];

        return new ZodParseError({
            errors,
            message: "Duplicate seat: coordinates (x, y) must be unique.",
        });
    }
}
