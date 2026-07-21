import {Types} from "mongoose";
import type {
    ReservedSeatSnapshotSchemaFields
} from "@/domains/seatmap/_model/seat-map-snapshot/ReservedSeatSnapshot.types.js";
import {SeatMap} from "@/domains/seatmap/_model/seat-map/SeatMap.model";
import type {SeatMapSchemaFields} from "@/domains/seatmap/_model/seat-map/SeatMap.types";
import {ReservedSeatSnapshotInputSchema} from "@/domains/seatmap/_feat/validate-submit/ReservedSeatSnapshotInputSchema";
import {InconsistentDataError} from "@/shared/errors/InconsistentDataError";
import {ReservedSeatSnapshot} from "@/domains/seatmap/_model/seat-map-snapshot/ReservedSeatSnapshot.model.js";
import type {SeatSchemaFields} from "@/domains/seat/model";
import generateArraySchema from "@/shared/utility/schema/generateArraySchema";

type SeatMapWithInfo = Omit<SeatMapSchemaFields, "seat"> & {
    seat: SeatSchemaFields;
};

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

    const {data, success, error} = generateArraySchema(ReservedSeatSnapshotInputSchema).safeParse(snapshots);

    if (!success) {
        throw new InconsistentDataError({
            modelName: ReservedSeatSnapshot.name,
            errors: error?.errors,
            message: "Failed to validate seat map data.",
        });
    }

    return data;
}
