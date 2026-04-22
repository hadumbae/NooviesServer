/**
 * @fileoverview Mongoose model for storing immutable, point-in-time snapshots of theatre data.
 */

import { type Model, model } from "mongoose";
import { TheatreSnapshotSchema } from "./TheatreSnapshot.schema.js";
import type { TheatreSnapshotSchemaFields } from "./TheatreSnapshot.types.js";

/**
 * Model representing a static record of a theatre's state used for historical integrity in reservations and tickets.
 */
export const TheatreSnapshot: Model<TheatreSnapshotSchemaFields> =
    model<TheatreSnapshotSchemaFields>("TheatreSnapshot", TheatreSnapshotSchema);