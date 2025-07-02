import {z} from "zod";
import {SeatDetailsSchema, SeatSchema} from "./Seat.schema.js";

/**
 * Inferred TypeScript type from {@link SeatSchema}.
 * Represents a seat object with optional ID or populated screen/theatre references.
 */
export type ZSeat = z.infer<typeof SeatSchema>;

/**
 * Inferred TypeScript type from {@link SeatDetailsSchema}.
 * Represents a seat object with fully populated screen and theatre objects.
 */
export type ZSeatDetails = z.infer<typeof SeatDetailsSchema>;