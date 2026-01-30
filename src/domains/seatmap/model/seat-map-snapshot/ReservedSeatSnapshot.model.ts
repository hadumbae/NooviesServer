/**
 * @file ReservedSeatSnapshot.model.ts
 *
 * Mongoose model for reserved seat snapshots.
 *
 * @remarks
 * Represents an immutable, point-in-time snapshot of a seat as it
 * existed at reservation time. This model is intended strictly for
 * embedding within higher-level snapshots such as:
 * - Reserved showings
 * - Reservations
 * - Tickets
 *
 * Snapshot documents are write-once and must never be mutated after
 * creation to preserve historical and financial integrity.
 */

import {model, type Model} from "mongoose";
import type {ReservedSeatSnapshotSchemaFields} from "./ReservedSeatSnapshot.types.js";
import {ReservedSeatSnapshotSchema} from "./ReservedSeatSnapshot.schema.js";

/**
 * Reserved seat snapshot model.
 */
export const ReservedSeatSnapshot: Model<ReservedSeatSnapshotSchemaFields> =
    model<ReservedSeatSnapshotSchemaFields>("ReservedSeatSnapshot", ReservedSeatSnapshotSchema);
