/**
 * @fileoverview Mongoose model for immutable movie snapshots used to preserve historical data.
 */

import { model, type Model } from "mongoose";
import type { MovieSnapshotSchemaFields } from "./MovieSnapshot.types.js";
import { MovieSnapshotSchema } from "./MovieSnapshot.schema.js";

/**
 * Movie snapshot model.
 */
export const MovieSnapshot: Model<MovieSnapshotSchemaFields> =
    model<MovieSnapshotSchemaFields>("MovieSnapshot", MovieSnapshotSchema);
