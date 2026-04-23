/**
 * @fileoverview TypeScript type definitions for the Seat schema fields.
 */

import { Types } from "mongoose";
import type { SeatLayoutType, SeatType } from "@domains/seat/schema";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {ModelTimestamps} from "@shared/types/schema/ModelTimestamps";

/**
 * Type representing the persistence structure of a Seat document in MongoDB.
 */
export type SeatSchemaFields = BaseModel & ModelTimestamps & {
    /** Reference to the parent Screen. */
    screen: Types.ObjectId;

    /** Reference to the parent Theatre. */
    theatre: Types.ObjectId;

    /** Row identifier (e.g., "A", "B"). */
    row: string;

    /** Numeric position within the row; typically unique per row. */
    seatNumber: number;

    /** Optional display label (e.g., "A5", "VIP-1"). */
    seatLabel?: string;

    /** Category of seat (e.g., REGULAR, VIP, ACCESSIBLE). */
    seatType: SeatType;

    /** grid role: "SEAT", "AISLE", or "STAIR". */
    layoutType: SeatLayoutType;

    /** Boolean flag indicating if the seat is functional and bookable. */
    isAvailable: boolean;

    /** Multiplier used to adjust the base ticket price for specific seat types. */
    priceMultiplier: number;

    /** Horizontal coordinate in the screen's layout grid. */
    x: number;

    /** Vertical coordinate in the screen's layout grid. */
    y: number;

    /** URL-safe unique identifier for the seat. */
    slug: string;
};