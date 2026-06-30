/**
 * @fileoverview Mongoose model for immutable movie snapshots used to preserve historical data.
 */

import { model, type Model } from "mongoose";
import type { MovieSnapshotSchemaFields } from "@/domains/movies/_models/movie-snapshot/MovieSnapshot.types.js";
import { MovieSnapshotSchema } from "@/domains/movies/_models/movie-snapshot/MovieSnapshot.schema.js";

/**
 * Movie snapshot model.
 */
export const MovieSnapshot: Model<MovieSnapshotSchemaFields> =
    model<MovieSnapshotSchemaFields>("MovieSnapshot", MovieSnapshotSchema);
