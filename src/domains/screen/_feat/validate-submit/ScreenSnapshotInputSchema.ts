/**
 * @fileoverview Validation schema for Screen snapshot data.
 * Ensures the integrity of immutable screen records embedded within historical documents.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";
import {ScreenTypeSchema} from "@domains/screen/validation";

/**
 * Zod schema for validating the payload used to create a Screen snapshot.
 */
export const ScreenSnapshotInputSchema = z.object({
    theatre: ObjectIdSchema,
    screenType: ScreenTypeSchema,
    name: NonEmptyStringSchema.max(255, "Name must be 255 characters or less."),
});

/**
 * TypeScript type inferred from ScreenSnapshotInputSchema.
 */
export type ScreenSnapshotInputData = z.infer<typeof ScreenSnapshotInputSchema>;