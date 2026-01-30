/**
 * @file TheatreSnapshot.model.ts
 *
 * Mongoose model for theatre snapshots.
 *
 * @remarks
 * Represents an immutable, point-in-time snapshot of a theatre as it
 * existed when a reservation or related entity was created.
 *
 * This model is intended to be write-once and embedded or referenced
 * by historical records such as:
 * - Reservations
 * - Showings
 * - Tickets
 * - Audit and history documents
 */

import { type Model, model } from "mongoose";
import { TheatreSnapshotSchema } from "./TheatreSnapshot.schema.js";
import type { TheatreSnapshotSchemaFields } from "./TheatreSnapshot.types.js";

/**
 * Theatre snapshot model.
 *
 * @remarks
 * Instances of this model must not be mutated after creation to
 * preserve historical integrity.
 */
export const TheatreSnapshot: Model<TheatreSnapshotSchemaFields> =
    model<TheatreSnapshotSchemaFields>(
        "TheatreSnapshot",
        TheatreSnapshotSchema
    );
