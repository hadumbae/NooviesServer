/**
 * @fileoverview Defines the Mongoose model for snapshots of showing data at the time of reservation.
 */

import { type Model, model } from "mongoose";
import { ReservedShowingSnapshotSchema } from "src/domains/reservations/_model/showing-snapshot/ReservedShowingSnapshot.schema.js";
import type { ReservedShowingSnapshotSchemaFields } from "src/domains/reservations/_model/showing-snapshot/ReservedShowingSnapshot.types.js";

import "src/domains/reservations/_model/showing-snapshot/ReservedShowingSnapshot.hooks.js";

/** Mongoose model for the ReservedShowingSnapshot collection. */
export const ReservedShowingSnapshot: Model<ReservedShowingSnapshotSchemaFields> =
    model<ReservedShowingSnapshotSchemaFields>(
        "ReservedShowingSnapshot",
        ReservedShowingSnapshotSchema
    );
