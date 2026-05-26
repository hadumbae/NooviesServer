/**
 * @fileoverview Service for generating immutable data snapshots for reservations.
 */

import {Types} from "mongoose";
import type {
    ReservedShowingSnapshotSchemaFields
} from "@domains/reservation/model/snapshots/showing-snapshot/ReservedShowingSnapshot.types";
import Showing from "@domains/showing/models/showing/Showing.model";
import {DocumentNotFoundError} from "@shared/errors/DocumentNotFoundError";
import {InconsistentDataError} from "@shared/errors/InconsistentDataError";
import {createMovieSnapshot} from "@domains/movie/_feat/manage-snapshots/createMovieSnapshot";
import type {ShowingSchemaFields} from "@domains/showing/models/showing/Showing.types";
import {createReservedSeatSnapshot} from "@domains/seatmap/utilities/snapshots/createReservedSeatSnapshot";
import {ReservedShowingSnapshotInputSchema} from "@domains/reservation/_feat/reserve-tickets/schemas";
import {createScreenSnapshot} from "@domains/screen/_feat/build-snapshot";
import {createTheatreSnapshot} from "@domains/theatre/utilities";
import type {ReservationType} from "@domains/reservation/validation/enums";

type ShowingWithReferences = Omit<ShowingSchemaFields, "movie" | "theatre" | "screen"> & {
    movie: Types.ObjectId;
    theatre: Types.ObjectId;
    screen: Types.ObjectId;
}

/** Input parameters required to generate a historically accurate showing snapshot. */
export type CreateReservedShowingSnapshotParams = {
    pricePaid: number;
    ticketCount: number;
    reservationType: ReservationType;
    showingID: Types.ObjectId;
    selectedSeating?: Types.ObjectId[] | null | undefined;
};

/**
 * Orchestrates the creation of a deep, immutable snapshot for a specific reservation.
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