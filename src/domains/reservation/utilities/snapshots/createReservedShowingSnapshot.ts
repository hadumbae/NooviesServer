import {Types} from "mongoose";
import type {
    ReservedShowingSnapshotSchemaFields
} from "../../model/snapshots/showing-snapshot/ReservedShowingSnapshot.types.js";
import Showing from "../../../showing/model/showing/Showing.model.js";
import {DocumentNotFoundError} from "../../../../shared/errors/DocumentNotFoundError.js";
import {InconsistentDataError} from "../../../../shared/errors/InconsistentDataError.js";
import {ReservedShowingSnapshotInputSchema} from "../../schemas/ReservedShowingSnapshotInputSchema.js";
import {createMovieSnapshot} from "../../../movie/utilities/snapshots/createMovieSnapshot.js";
import {createTheatreSnapshot} from "../../../theatre/utilities/snapshots/createTheatreSnapshot.js";
import {createScreenSnapshot} from "../../../screen/utilities/snapshot/createScreenSnapshot.js";
import type {ShowingSchemaFields} from "../../../showing/model/showing/Showing.types.js";
import {createReservedSeatSnapshot} from "../../../seatmap/utilities/snapshots/createReservedSeatSnapshot.js";
import ShowingModel from "../../../showing/model/showing/Showing.model.js";
import type {ReservationType} from "../../schemas/enum/ReservationTypeEnumSchema.js";

/**
 * Showing document with resolved reference identifiers.
 *
 * Used internally to derive immutable snapshot components without
 * relying on populated documents.
 */
interface ShowingWithReferences extends ShowingSchemaFields {
    movie: Types.ObjectId;
    theatre: Types.ObjectId;
    screen: Types.ObjectId;
}

/**
 * Parameters required to create a reserved showing snapshot.
 */
type SnapshotParams = {
    /**
     * Total price paid for the reservation.
     *
     * @remarks
     * This value is authoritative and must not be recalculated from
     * ticket count or seat pricing after snapshot creation.
     */
    pricePaid: number;

    /**
     * Number of tickets included in the reservation.
     *
     * @remarks
     * Must be consistent with {@link reservationType} and
     * {@link selectedSeating} when applicable.
     */
    ticketCount: number;

    /**
     * Reservation type applied at booking time.
     *
     * @remarks
     * Determines whether seat selection is required or forbidden.
     */
    reservationType: ReservationType;

    /** Identifier of the source showing. */
    showingID: Types.ObjectId;

    /**
     * Optional seat map selections associated with the reservation.
     *
     * @remarks
     * - Required for seat-reserved reservation types
     * - Omitted or null for non-seated reservations
     */
    selectedSeating?: Types.ObjectId[] | null | undefined;
};

/**
 * Creates an immutable snapshot of a showing at the moment of reservation.
 *
 * This function:
 * - resolves the source showing document
 * - embeds immutable snapshots of movie, theatre, screen, and selected seats
 * - records authoritative pricing, ticket count, and reservation type
 * - validates the assembled snapshot against input constraints
 *
 * The resulting snapshot is intended to be persisted as part of a reservation
 * and must remain historically accurate even if the underlying entities
 * (showing, movie, theatre, screen, or seat maps) change later.
 *
 * Any validation failure indicates inconsistent or corrupted source data and
 * results in an {@link InconsistentDataError}.
 *
 * @param params Snapshot creation parameters.
 * @returns A validated reserved showing snapshot ready for persistence.
 * @throws DocumentNotFoundError When the source showing cannot be found.
 * @throws InconsistentDataError When derived snapshot data fails validation.
 */
export async function createReservedShowingSnapshot(
    {showingID, selectedSeating, pricePaid, ticketCount, reservationType}: SnapshotParams
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
            movie: createMovieSnapshot(movie),
            theatre: createTheatreSnapshot(theatre),
            screen: createScreenSnapshot(screen),
            selectedSeats: createReservedSeatSnapshot(selectedSeating),
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
