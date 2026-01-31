/**
 * @file createTheatreSnapshot.ts
 *
 * Factory function for creating an immutable theatre snapshot.
 *
 * @remarks
 * Resolves the current Theatre document and validates it against
 * the snapshot input schema before producing a write-once snapshot.
 * Used to preserve historical integrity for reservations, tickets,
 * and audit records.
 */

import {Types} from "mongoose";
import {TheatreSnapshotInputSchema} from "../../schema/TheatreSnapshotInputSchema.js";
import type {TheatreSnapshotSchemaFields} from "../../model/theatre-snapshot/TheatreSnapshot.types.js";
import Theatre from "../../model/Theatre.model.js";
import {InconsistentDataError} from "../../../../shared/errors/InconsistentDataError.js";
import {TheatreSnapshot} from "../../model/theatre-snapshot/TheatreSnapshot.model.js";
import {DocumentNotFoundError} from "../../../../shared/errors/DocumentNotFoundError.js";

/**
 * Create an immutable snapshot of a theatre at a specific point in time.
 *
 * @param theatreID - ObjectId of the theatre to snapshot.
 *
 * @returns A validated theatre snapshot schema instance.
 *
 * @throws {@link DocumentNotFoundError}
 * Thrown if the theatre cannot be found.
 *
 * @throws {@link InconsistentDataError}
 * Thrown if the theatre data violates snapshot schema invariants.
 */
export async function createTheatreSnapshot(
    theatreID: Types.ObjectId
): Promise<TheatreSnapshotSchemaFields> {
    const theatre = await Theatre.findById(theatreID).lean();

    if (!theatre) {
        throw new DocumentNotFoundError({
            model: Theatre,
            identifier: theatreID,
            message: "Failed to fetch theatre for snapshot.",
        });
    }

    const {name, location} = theatre;
    const {data, success, error} = TheatreSnapshotInputSchema.safeParse({name, ...location});

    if (!success) {
        throw new InconsistentDataError({
            modelName: TheatreSnapshot.name,
            message: "Inconsistent data, unable to create snapshot.",
            errors: error?.errors,
        });
    }

    return data;
}
