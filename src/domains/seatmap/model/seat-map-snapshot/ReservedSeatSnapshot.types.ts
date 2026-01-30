/**
 * @file SeatMapSnapshot.types.ts
 *
 * @description
 * Immutable snapshot field definitions for a reserved seat.
 *
 * Captures the full, finalized state of an individual seat at reservation time,
 * including its identity, classification, optional display label, and price.
 * This snapshot prevents historical or financial drift if the underlying seat
 * map, pricing rules, or seat metadata change after reservation.
 */

import type { SeatType } from "../../../seat/schema/enum/SeatTypeEnum.js";
import { Types } from "mongoose";

/**
 * Reserved seat snapshot schema fields.
 *
 * Represents a single seat as it existed at the moment of reservation,
 * independent of future seat map modifications.
 */
export interface ReservedSeatSnapshotSchemaFields {
    /** Reference to the originating seat map entry. */
    seatMap: Types.ObjectId;

    /** Stable identifier linking back to the original seat definition. */
    seatIdentifier: string;

    /** Logical seat classification (e.g. regular, VIP, disabled). */
    seatType: SeatType;

    /** Optional human-readable seat label (e.g. "A12"). */
    seatLabel?: string;

    /** Final price assigned to the seat at snapshot time. */
    pricePaid: number;
}
