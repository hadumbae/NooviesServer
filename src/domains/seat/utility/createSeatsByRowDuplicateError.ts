import type { ZodIssue } from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

export default function createSeatDuplicateError(indexString: string) {
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
