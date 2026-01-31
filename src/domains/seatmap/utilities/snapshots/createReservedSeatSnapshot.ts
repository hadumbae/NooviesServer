import {Types} from "mongoose";
import type {ReservedSeatSnapshotSchemaFields} from "../../model/seat-map-snapshot/ReservedSeatSnapshot.types.js";
import SeatMap from "../../model/SeatMap.model.js";
import type {SeatMapSchemaFields} from "../../model/SeatMap.types.js";
import type {SeatSchemaFields} from "../../../seat/model/Seat.types.js";
import {ReservedSeatSnapshotInputArraySchema} from "../../schema/ReservedSeatSnapshotInputSchema.js";
import {InconsistentDataError} from "../../../../shared/errors/InconsistentDataError.js";
import {ReservedSeatSnapshot} from "../../model/seat-map-snapshot/ReservedSeatSnapshot.model.js";

/**
 * Seat map document populated with its associated seat definition.
 *
 * Used internally to derive immutable snapshot values.
 */
interface SeatMapWithInfo extends SeatMapSchemaFields {
    seat: SeatSchemaFields;
}

/**
 * Creates immutable reserved seat snapshots from a list of seat map IDs.
 *
 * This function:
 * - resolves seat map documents and their associated seat definitions
 * - derives a stable seat identifier and final price
 * - validates the derived data against snapshot input constraints
 * - returns data safe for persistence as a reservation snapshot
 *
 * Pricing resolution rules:
 * - `overridePrice` takes precedence when present
 * - otherwise, `basePrice * priceMultiplier` is used
 *
 * Return semantics:
 * - `null` when `seating` is null or undefined (no seat selection)
 * - empty array when `seating` is an empty array
 *
 * Any validation failure indicates inconsistent or corrupted seat map data
 * and results in an {@link InconsistentDataError}.
 *
 * @param seating Array of seat map ObjectIds selected for reservation.
 * @returns Validated reserved seat snapshot data or null.
 * @throws InconsistentDataError When derived snapshot data fails validation.
 */
export async function createReservedSeatSnapshot(
    seating: Types.ObjectId[] | null | undefined,
): Promise<ReservedSeatSnapshotSchemaFields[] | null> {
    if (!seating) return null;
    if (seating.length === 0) return [];

    const seatMaps = await SeatMap
        .find({_id: {$in: seating}})
        .populate(["seat"])
        .lean() as SeatMapWithInfo[];

    const snapshots: ReservedSeatSnapshotSchemaFields[] = seatMaps.map(seatMap => {
        const {_id, overridePrice, priceMultiplier, basePrice, seat} = seatMap;
        const {seatType, seatLabel, seatNumber, row} = seat;

        return {
            seatMap: _id,
            seatIdentifier: `${row}-${seatNumber}`,
            pricePaid: overridePrice ?? (basePrice * priceMultiplier),
            seatType,
            seatLabel,
        };
    });

    const {data, success, error} = ReservedSeatSnapshotInputArraySchema.safeParse(snapshots);

    if (!success) {
        throw new InconsistentDataError({
            modelName: ReservedSeatSnapshot.name,
            errors: error?.errors,
            message: "Failed to validate seat map data.",
        });
    }

    return data;
}
