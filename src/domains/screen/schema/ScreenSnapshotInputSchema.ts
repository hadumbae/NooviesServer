/**
 * @file ScreenSnapshotInputSchema.ts
 *
 * @description
 * Zod schema for validating a snapshot of a cinema screen.
 *
 * Ensures that the screen snapshot captures the essential state at a
 * specific point in time (e.g., for embedding in theatre or showing
 * snapshots). Validates required fields and enforces length and type
 * constraints.
 *
 * Fields:
 * - `theatre`: ObjectId reference to the parent theatre.
 * - `screenType`: Type of screen, constrained by `ScreenTypeEnum`.
 * - `name`: Human-readable name of the screen (1–255 characters).
 *
 * This schema is intended for:
 * - Embedding in showing snapshots
 * - Embedding in theatre snapshots
 * - Any place where an immutable screen representation is required
 */
import { z } from "zod";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { ScreenTypeEnum } from "./enum/ScreenTypeEnum.js";

/** Zod schema for a cinema screen snapshot. */
export const ScreenSnapshotInputSchema = z.object({
    /** Reference to the theatre this screen belongs to. */
    theatre: ObjectIdSchema,

    /** Type of the screen (e.g., Standard, IMAX, 4DX). */
    screenType: ScreenTypeEnum,

    /** Name of the screen. Must be 1–255 characters. */
    name: NonEmptyStringSchema
        .min(1, "Required.")
        .max(255, "Name must be 255 characters or less."),
});

/** TypeScript type inferred from `ScreenSnapshotInputSchema`. */
export type ScreenSnapshotInputData = z.infer<typeof ScreenSnapshotInputSchema>;
