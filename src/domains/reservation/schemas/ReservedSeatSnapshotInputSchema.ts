/**
 * @file ReservedSeatSnapshotInputSchema.ts
 *
 * @description
 * Zod schema for validating input when creating a reserved seat snapshot.
 *
 * Captures the immutable, seat-level details at the moment of reservation,
 * including a reference to the originating seat map, stable seat identifier,
 * logical seat classification, final price paid, and an optional display label.
 *
 * This schema is used to freeze seat identity and pricing so that reservations
 * remain historically and financially correct even if the underlying seat map
 * or pricing rules change later.
 *
 * Intended usage:
 * - Creating reserved seat snapshots for reservations
 * - Validating API or form input for seat selection
 * - Embedding within reserved showing snapshot input schemas
 */

import { z } from "zod";
import { SeatTypeEnum } from "../../seat/schema/enum/SeatTypeEnum.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";

/**
 * Reserved seat snapshot input validation schema.
 */
export const ReservedSeatSnapshotInputSchema = z.object({
    /** Reference to the originating seat map entry. */
    seatMap: ObjectIdSchema,

    /** Stable identifier for the seat (max 20 characters). */
    seatIdentifier: NonEmptyStringSchema.max(20, "Must be 20 characters or less."),

    /** Logical seat classification (e.g. regular, VIP, disabled). */
    seatType: SeatTypeEnum,

    /** Final price paid for this seat. */
    pricePaid: PositiveNumberSchema,

    /** Optional human-readable seat label (e.g. "A12"). */
    seatLabel: NonEmptyStringSchema
        .max(50, "Must be 50 characters or less.")
        .optional(),
});

/**
 * Type representing validated reserved seat snapshot input data.
 */
export type ReservedSeatSnapshotInputData =
    z.infer<typeof ReservedSeatSnapshotInputSchema>;
