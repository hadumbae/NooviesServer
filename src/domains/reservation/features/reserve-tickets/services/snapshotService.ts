/**
 * @file Service for generating immutable data snapshots for reservations.
 * @filename snapshotService.ts
 */

import {Types} from "mongoose";
import type {
    ReservedShowingSnapshotSchemaFields
} from "@domains/reservation/model/snapshots/showing-snapshot/ReservedShowingSnapshot.types";
import Showing from "@domains/showing/models/showing/Showing.model";
import ShowingModel from "@domains/showing/models/showing/Showing.model";
import {DocumentNotFoundError} from "@shared/errors/DocumentNotFoundError";
import {InconsistentDataError} from "@shared/errors/InconsistentDataError";
import {ReservedShowingSnapshotInputSchema} from "../../../schemas/ReservedShowingSnapshotInputSchema";
import {createMovieSnapshot} from "@domains/movie/utilities/snapshots/createMovieSnapshot";
import {createTheatreSnapshot} from "@domains/theatre/utilities/snapshots/createTheatreSnapshot";
import {createScreenSnapshot} from "@domains/screen/utilities/snapshot/createScreenSnapshot";
import type {ShowingSchemaFields} from "@domains/showing/models/showing/Showing.types";
import {createReservedSeatSnapshot} from "@domains/seatmap/utilities/snapshots/createReservedSeatSnapshot";
import type {
    CreateReservedShowingSnapshotParams
} from "@domains/reservation/features/reserve-tickets/services/snapshotService.types";

/**
 * Internal interface representing a Showing document with unresolved ObjectIDs.
 * Used to safely access reference IDs for downstream snapshot sub-services.
 */
interface ShowingWithReferences extends ShowingSchemaFields {
    movie: Types.ObjectId;
    theatre: Types.ObjectId;
    screen: Types.ObjectId;
}

/**
 * Generates a comprehensive, immutable snapshot of a showing's state at booking time.
 * @param params - Contextual data including price, count, and IDs.
 * @returns A validated, persistence-ready snapshot object.
 * @throws {DocumentNotFoundError} 404 - If the source showing is missing.
 * @throws {InconsistentDataError} 422 - If sub-snapshots fail validation (e.g., missing movie data).
 */
export async function createReservedShowingSnapshot(
    {showingID, selectedSeating, pricePaid, ticketCount, reservationType}: CreateReservedShowingSnapshotParams
): Promise<ReservedShowingSnapshotSchemaFields> {
    const showing = await Showing.findById(showingID).lean();

    if (!showing) {
        throw new DocumentNotFoundError({
            model: Showing,
            identifier: showingID,
            message: "Failed to fetch showing for snapshot.",
        });
    }

    const {movie, theatre, screen} = showing as ShowingWithReferences;


    const {data, success, error} =
        ReservedShowingSnapshotInputSchema.safeParse({
            ...showing,
            pricePaid,
            ticketCount,
            reservationType,
            movie: await createMovieSnapshot(movie),
            theatre: await createTheatreSnapshot(theatre),
            screen: await createScreenSnapshot(screen),
            selectedSeats: await createReservedSeatSnapshot(selectedSeating),
        });

    if (!success) {
        throw new InconsistentDataError({
            modelName: ShowingModel.name,
            message: "Inconsistent data, unable to create snapshot.",
            errors: error?.errors,
        });
    }

    return data;
}