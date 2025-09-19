import {z} from "zod";
import {SeatsByRowInputSchema} from "./SeatInput.schema.js";

/**
 * 🎟️ Data for submitting seats by row.
 *
 * Inferred from `SeatsByRowInputSchema` using Zod, this type represents
 * the validated shape expected by your service or controller.
 */
export type SeatsByRowSubmitData = z.infer<typeof SeatsByRowInputSchema>;