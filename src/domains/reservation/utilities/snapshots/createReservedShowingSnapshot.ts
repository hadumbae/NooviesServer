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
import {ReservedShowingSnapshot} from "../../model/snapshots/showing-snapshot/ReservedShowingSnapshot.model.js";

/**
 * Showing document with populated reference identifiers.
 *
 * Used internally to derive immutable snapshot components.
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
    /** Total price paid for the reservation. */
    pricePaid: number;

    /** Identifier of the source showing. */
    showingID: Types.ObjectId;

    /**
     * Optional seat map selections associated with the reservation.
     *
     * When omitted or null, the snapshot represents a non-seated reservation.
     */
    selectedSeating?: Types.ObjectId[] | null | undefined;
};

/**
 * Creates an immutable snapshot of a showing at the moment of reservation.
 *
 * This function:
 * - resolves the source showing document
 * - embeds immutable snapshots of movie, theatre, screen, and selected seats
 * - records the authoritative total price paid
 * - validates the assembled snapshot input
 *
 * The resulting snapshot is intended to be persisted as part of a reservation
 * and must remain historically accurate even if the underlying entities
 * (showing, movie, theatre, screen, seat maps) change later.
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
    {showingID, selectedSeating, pricePaid}: SnapshotParams
): Promise<ReservedShowingSnapshotSchemaFields> {
    const showing = await Showing.findById(showingID);
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

    return new ReservedShowingSnapshot(data);
}
