/**
 * @fileoverview Defines the schema fields for a snapshot of a reserved seat within a seat map.
 */

import { Types } from "mongoose";
import type { SeatType } from "@/domains/seat/_validation";

/** Schema fields for the ReservedSeatSnapshot model. */
export type ReservedSeatSnapshotSchemaFields = {
    seatMap: Types.ObjectId;
    seatIdentifier: string;
    seatType: SeatType;
    seatLabel?: string;
    pricePaid: number;
}
