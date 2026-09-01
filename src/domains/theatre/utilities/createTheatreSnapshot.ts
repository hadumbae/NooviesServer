/**
 * @fileoverview Utility function for creating immutable snapshots of theatre documents for audit and historical tracking.
 */

import {Types} from "mongoose";
import {TheatreSnapshotInputSchema} from "@/domains/theatre/validation/TheatreSnapshotInputSchema";
import {InconsistentDataError} from "@/shared/errors/InconsistentDataError";
import {DocumentNotFoundError} from "@/shared/errors/DocumentNotFoundError";
import {Theatre} from "@/domains/theatre/model/theatre";
import {TheatreSnapshot, type TheatreSnapshotSchemaFields} from "@/domains/theatre/model/theatre-snapshot";

/** Creates an immutable validated snapshot of a theatre at a specific point in time. */
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