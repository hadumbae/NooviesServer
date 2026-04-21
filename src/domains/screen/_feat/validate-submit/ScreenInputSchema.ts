/**
 * @fileoverview Validation schema for Screen entity input data.
 * Enforces business rules for cinema auditorium configuration, including
 * physical capacity limits and technological classification.
 */

import {z} from "zod";
import {TheatreAsyncIDString} from "@shared/schema/helpers/ZodIDHelpers";
import {PositiveNumberSchema} from "@shared/schema/numbers/PositiveNumberSchema";
import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";
import {ScreenTypeSchema} from "@domains/screen/validation";

/**
 * Zod schema for validating Screen creation and update payloads.
 */
export const ScreenInputSchema = z.object({
    name: NonEmptyStringSchema.max(255, "Name must be 255 characters or less."),
    capacity: PositiveNumberSchema.gt(0, "Capacity must be greater than 0"),
    screenType: ScreenTypeSchema,
    theatre: TheatreAsyncIDString,
});

/**
 * TypeScript type representing the validated input data for a Screen.
 */
export type ScreenInputData = z.infer<typeof ScreenInputSchema>;