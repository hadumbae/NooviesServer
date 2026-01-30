/**
 * @file ReservedShowingSnapshot.model.ts
 *
 * Mongoose model for reserved showing snapshots.
 *
 * Binds the immutable {@link ReservedShowingSnapshotSchema} to a concrete
 * model and registers all associated validation hooks.
 *
 * @remarks
 * This model represents a write-once, historical snapshot of a showing
 * at reservation time. Documents must not be mutated after creation.
 */

import { type Model, model } from "mongoose";
import { ReservedShowingSnapshotSchema } from "./ReservedShowingSnapshot.schema.js";
import type { ReservedShowingSnapshotSchemaFields } from "./ReservedShowingSnapshot.types.js";

import "./ReservedShowingSnapshot.hooks.js";

/**
 * Reserved showing snapshot model.
 */
export const ReservedShowingSnapshot: Model<ReservedShowingSnapshotSchemaFields> =
    model<ReservedShowingSnapshotSchemaFields>(
        "ReservedShowingSnapshot",
        ReservedShowingSnapshotSchema
    );
