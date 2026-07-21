/**
 * @fileoverview Defines the Mongoose model for screen snapshots.
 */

import { model, type Model } from "mongoose";
import { ScreenSnapshotSchema } from "@/domains/screen/_models/screen-snapshot/ScreenSnapshot.schema.js";
import type { ScreenSnapshotSchemaFields } from "@/domains/screen/_models/screen-snapshot/ScreenSnapshot.types.js";

/** Mongoose model for the ScreenSnapshot collection. */
export const ScreenSnapshot: Model<ScreenSnapshotSchemaFields> =
    model<ScreenSnapshotSchemaFields>(
        "ScreenSnapshot",
        ScreenSnapshotSchema
    );
