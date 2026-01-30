/**
 * @file ScreenSnapshot.model.ts
 *
 * Mongoose model for screen snapshots.
 *
 * @remarks
 * Represents an immutable, point-in-time snapshot of a screen as embedded
 * within other domain snapshots (e.g. reserved showings). Intended to be
 * write-once and never mutated after creation.
 */

import { model, type Model } from "mongoose";
import type { ScreenSnapshotSchemaFields } from "./ScreenSnapshot.types.js";
import { ScreenSnapshotSchema } from "./ScreenSnapshot.schema.js";

/**
 * Screen snapshot mongoose model.
 */
export const ScreenSnapshot: Model<ScreenSnapshotSchemaFields> =
    model<ScreenSnapshotSchemaFields>(
        "ScreenSnapshot",
        ScreenSnapshotSchema
    );
