/**
 * @fileoverview Type definitions and schema field structures for the Mongoose Reservation model.
 */

import type {ReservedShowingSnapshotSchemaFields} from "@domains/reservation/model/snapshots/showing-snapshot";
import {Types} from "mongoose";
import type {ISO4217CurrencyCode} from "@shared/schema/enums/ISO4217CurrencyCodeEnumSchema";
import type {ReservationStatus} from "@domains/reservation/validation/enums/ReservationStatusSchema";
import type {ReservationType} from "@domains/reservation/validation/enums/ReservationTypeSchema";
import type {NonNegativeNumber} from "@shared/schema/numbers/NonNegativeNumberSchema";
import type {BaseModelWithSlug} from "@shared/types/schema/BaseModel";
import type {ModelTimestamps} from "@shared/types/schema/ModelTimestamps";
import type {ModelSoftDelete} from "@shared/types/schema/ModelSoftDelete";

/** Composite metadata for the Reservation model including slug, timestamps, and soft-delete fields. */
type ReservationModelMeta = BaseModelWithSlug & ModelTimestamps & ModelSoftDelete;

/** Lifecycle date fields for tracking reservation state transitions and TTL logic. */
type ReservationDateSchemaFields = {
    dateReserved: Date;
    datePaid?: Date | null;
    dateCancelled?: Date | null;
    dateRefunded?: Date | null;
    dateExpired?: Date | null;
    expiresAt: Date;
}

/** Financial and quantity data for the reservation transaction. */
type ReservationPaymentSchemaFields = {
    ticketCount: number;
    pricePaid: NonNegativeNumber;
    currency: ISO4217CurrencyCode;
    isPaid: boolean;
}

/** Relational associations and immutable data snapshots for the reservation. */
type ReservationRelatedSchemaFields = {
    user: Types.ObjectId;
    showing: Types.ObjectId;
    snapshot: ReservedShowingSnapshotSchemaFields;
}

/** Identification and configuration metadata for the reservation. */
type ReservationMetaSchemaFields = {
    selectedSeating?: Types.ObjectId[] | null;
    status: ReservationStatus;
    reservationType: ReservationType;
    uniqueCode: string;
    notes?: string | null;
};

/** Comprehensive field definitions for the Reservation schema. */
export type ReservationSchemaFields =
    ReservationModelMeta &
    ReservationDateSchemaFields &
    ReservationPaymentSchemaFields &
    ReservationRelatedSchemaFields &
    ReservationMetaSchemaFields;

/** Refined TypeScript type for the Reservation document using Discriminated Unions. */
export type ReservationDoc = Omit<ReservationSchemaFields, "reservationType" | "selectedSeating"> & (| {
    reservationType: "GENERAL_ADMISSION";
    selectedSeating?: null
} | {
    reservationType: "RESERVED_SEATS";
    selectedSeating: Types.ObjectId[]
});
