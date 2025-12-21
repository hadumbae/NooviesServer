/**
 * @file SeatMapSnapshot.types.ts
 *
 * @description
 * Immutable snapshot field definitions for a seat entry.
 *
 * Captures the identity, classification, label, and pricing of a seat at the
 * time of reservation or showing creation to prevent historical drift when
 * the underlying seat map changes.
 */

import type { SeatType } from "../../../../seat/schema/enum/SeatTypeEnum.js";

/**
 * Reserved seat snapshot schema fields.
 */
export interface ReservedSeatSnapshotSchemaFields {
    /** Stable identifier linking back to the original seat. */
    seatIdentifier: string;

    /** Logical seat classification (e.g. regular, VIP, disabled). */
    seatType: SeatType;

    /** Optional human-readable seat label (e.g. "A12"). */
    seatLabel?: string;

    /** Final price assigned to the seat at snapshot time. */
    pricePaid: number;
}
