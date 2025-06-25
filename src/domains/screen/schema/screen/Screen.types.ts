import {z} from "zod";
import {ScreenDetailsSchema, ScreenSchema} from "./Screen.schema.js";

/**
 * Zod-inferred TypeScript type representing a basic screen object.
 *
 * This corresponds to the structure defined in `ScreenSchema` and aligns
 * with the `IScreen` interface, including screen ID, name, capacity,
 * screen type, and theatre reference (as ID or object).
 */
export type ZScreen = z.infer<typeof ScreenSchema>;

/**
 * Zod-inferred TypeScript type representing a detailed screen object.
 *
 * This corresponds to `ScreenDetailsSchema`, which includes full screen data,
 * with populated theatre, list of seats, and showings. Aligns with `IScreenDetails`.
 */
export type ZScreenDetails = z.infer<typeof ScreenDetailsSchema>;