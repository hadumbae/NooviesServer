/**
 * @file SeatMapSnapshot.types.ts
 *
 * @description
 * Snapshot schema fields representing a seat entry at the time of reservation
 * or showing creation. Used to preserve seat identity, classification, and
 * pricing independently of future seat map changes.
 */

import type { SeatType } from "../../../seat/schema/enum/SeatTypeEnum.js";

/**
 * Immutable snapshot of a seat within a seat map.
 *
 * @property seatIdentifier - Stable identifier linking back to the original seat.
 * @property seatType - Logical seat classification (e.g. regular, VIP, disabled).
 * @property seatLabel - Optional human-readable label (e.g. "A12").
 * @property price - Final price assigned to the seat at snapshot time.
 */
export interface SeatMapSnapshotSchemaFields {
    seatIdentifier: string;
    seatType: SeatType;
    seatLabel?: string;
    price: number;
}
