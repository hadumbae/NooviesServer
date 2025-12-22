/**
 * @file ScreenInput.schema.ts
 *
 * @summary
 * Zod schema for validating cinema screen input.
 *
 * @description
 * Used for validating payloads when creating or updating
 * screens, enforcing naming, capacity, screen type, and
 * theatre reference constraints.
 */

import { z } from "zod";
import { TheatreAsyncIDString } from "../../../shared/schema/helpers/ZodIDHelpers.js";
import { ScreenTypeEnum } from "./enum/ScreenTypeEnum.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";

/**
 * @summary
 * Screen input validation schema.
 */
export const ScreenInputSchema = z.object({
    /** Screen name. */
    name: NonEmptyStringSchema
        .min(1, "Required.")
        .max(255, "Name must be 255 characters or less."),

    /** Seating capacity of the screen. */
    capacity: PositiveNumberSchema
        .gt(0, "Capacity must be greater than 0"),

    /** Screen technology or format. */
    screenType: ScreenTypeEnum,

    /** Theatre the screen belongs to. */
    theatre: TheatreAsyncIDString,
});
