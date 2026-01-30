/**
 * @file ReservedSeatSnapshotInputSchema.ts
 *
 * Zod schema for validating input used to create a reserved seat snapshot.
 *
 * A reserved seat snapshot represents an immutable, seat-level record captured
 * at the moment of reservation. It freezes seat identity, classification, and
 * pricing so that historical reservations remain correct even if the underlying
 * seat map or pricing configuration changes later.
 *
 * This schema is intended strictly for input validation and is commonly:
 * - used when creating reservation records
 * - embedded within reserved showing snapshot input schemas
 * - applied to API or form submissions for seat selection
 */

import {z} from "zod";
import {SeatTypeEnum} from "../../seat/schema/enum/SeatTypeEnum.js";
import {NonEmptyStringSchema} from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {ObjectIdSchema} from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";

/**
 * Input validation schema for a single reserved seat snapshot.
 *
 * All fields represent finalized values at the time of reservation and are
 * expected to be persisted without later mutation.
 */
export const ReservedSeatSnapshotInputSchema = z.object({
    /**
     * ObjectId reference to the originating seat map entry.
     *
     * Used for traceability only; the seat map itself may change or be deleted
     * without affecting the integrity of the reservation snapshot.
     */
    seatMap: ObjectIdSchema,

    /**
     * Stable, system-level identifier for the seat.
     *
     * This value must remain consistent across seat map versions.
     */
    seatIdentifier: NonEmptyStringSchema.max(20, "Must be 20 characters or less."),

    /**
     * Logical seat classification at the time of reservation
     * (e.g. regular, VIP, disabled).
     */
    seatType: SeatTypeEnum,

    /**
     * Final price paid for this seat.
     *
     * This value is authoritative for financial records and must not be derived
     * from current pricing rules after reservation creation.
     */
    pricePaid: PositiveNumberSchema,

    /**
     * Optional human-readable seat label (e.g. "A12").
     *
     * Intended for display purposes only and not relied upon for seat identity.
     */
    seatLabel: NonEmptyStringSchema
        .max(50, "Must be 50 characters or less.")
        .optional(),
});

/**
 * Input validation schema for multiple reserved seat snapshots.
 */
export const ReservedSeatSnapshotInputArraySchema =
    generateArraySchema(ReservedSeatSnapshotInputSchema);

/**
 * Type representing validated reserved seat snapshot input.
 */
export type ReservedSeatSnapshotInputData =
    z.infer<typeof ReservedSeatSnapshotInputSchema>;

/**
 * Type representing an array of validated reserved seat snapshot inputs.
 */
export type ReservedSeatSnapshotInputArray =
    z.infer<typeof ReservedSeatSnapshotInputArraySchema>;
