/**
 * @fileoverview Mongoose model for reserved seat snapshots.
 */

import {model, type Model} from "mongoose";
import {ReservedSeatSnapshotSchema} from "@/domains/seatmap/_model/seat-map-snapshot/ReservedSeatSnapshot.schema.js";
import type {ReservedSeatSnapshotSchemaFields} from "@/domains/seatmap/_model/seat-map-snapshot/ReservedSeatSnapshot.types.js";

/** Mongoose model for the ReservedSeatSnapshot collection. */
export const ReservedSeatSnapshot: Model<ReservedSeatSnapshotSchemaFields> =
    model<ReservedSeatSnapshotSchemaFields>("ReservedSeatSnapshot", ReservedSeatSnapshotSchema);
