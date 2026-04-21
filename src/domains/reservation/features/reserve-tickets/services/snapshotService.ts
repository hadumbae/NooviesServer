/**
 * @fileoverview Service for generating immutable data snapshots for reservations.
 * Preserves the exact state of a Showing, Movie, Theatre, and Seating at the point of purchase.
 */

import {Types} from "mongoose";
import type {
    ReservedShowingSnapshotSchemaFields
} from "@domains/reservation/model/snapshots/showing-snapshot/ReservedShowingSnapshot.types";
import Showing from "@domains/showing/models/showing/Showing.model";
import {DocumentNotFoundError} from "@shared/errors/DocumentNotFoundError";
import {InconsistentDataError} from "@shared/errors/InconsistentDataError";
import {createMovieSnapshot} from "@domains/movie/utilities/snapshots/createMovieSnapshot";
import {createTheatreSnapshot} from "@domains/theatre/utilities/snapshots/createTheatreSnapshot";
import type {ShowingSchemaFields} from "@domains/showing/models/showing/Showing.types";
import {createReservedSeatSnapshot} from "@domains/seatmap/utilities/snapshots/createReservedSeatSnapshot";
import type {
    CreateReservedShowingSnapshotParams
} from "@domains/reservation/features/reserve-tickets/services/snapshotService.types";
import {ReservedShowingSnapshotInputSchema} from "@domains/reservation/features/reserve-tickets/schemas";
import {createScreenSnapshot} from "@domains/screen/_feat/build-snapshot";

/**
 * Internal interface representing a Showing document with unresolved ObjectIDs.
 */
type ShowingWithReferences = Omit<ShowingSchemaFields, "movie" | "theatre" | "screen"> & {
    movie: Types.ObjectId;
    theatre: Types.ObjectId;
    screen: Types.ObjectId;
}

/**
 * Orchestrates the creation of a deep, immutable snapshot for a specific reservation.
 * @returns A validated snapshot object conforming to {@link ReservedShowingSnapshotSchemaFields}.
 * @throws {DocumentNotFoundError} If the source `showingID` is invalid or missing.
 * @throws {InconsistentDataError} If any sub-factory fails or the combined schema is invalid.
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

    const {data, success, error} = ReservedShowingSnapshotInputSchema.safeParse({
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
            modelName: Showing.name,
            message: "Inconsistent source data: unable to finalize reservation snapshot.",
            errors: error?.errors,
        });
    }

    return data;
}