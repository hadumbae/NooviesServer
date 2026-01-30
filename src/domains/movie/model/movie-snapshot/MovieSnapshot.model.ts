/**
 * @file MovieSnapshot.model.ts
 *
 * Mongoose model for immutable movie snapshots.
 *
 * @remarks
 * Represents a write-once, point-in-time snapshot of a movie as it
 * existed at the moment of reservation or ticket issuance. Used to
 * preserve historical and financial integrity if the source movie
 * data changes later.
 */

import { model, type Model } from "mongoose";
import type { MovieSnapshotSchemaFields } from "./MovieSnapshot.types.js";
import { MovieSnapshotSchema } from "./MovieSnapshot.schema.js";

/**
 * Movie snapshot model.
 */
export const MovieSnapshot: Model<MovieSnapshotSchemaFields> =
    model<MovieSnapshotSchemaFields>(
        "MovieSnapshot",
        MovieSnapshotSchema
    );
