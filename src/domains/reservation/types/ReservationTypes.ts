/**
 * @file ReservationTypes.ts
 *
 * Shared type utilities for reservation-related Mongoose documents.
 *
 * @description
 * Provides strongly typed aliases that combine raw schema fields with
 * Mongoose `Document` behavior for use in service and data layers.
 */

import type { Document } from "mongoose";
import type { ReservationSchemaFields } from "../model/reservation/Reservation.types.js";

/**
 * Fully-typed Mongoose document for a Reservation.
 *
 * @description
 * Combines:
 * - {@link ReservationSchemaFields} (raw schema properties)
 * - Mongoose `Document` instance methods and metadata
 *
 * This type represents a hydrated Mongoose document returned from queries
 * that do NOT use `.lean()`.
 *
 * @remarks
 * - Use this type when document instance methods (e.g. `.save()`) are required.
 * - For read-only lean queries, prefer `ReservationSchemaFields`.
 * - Keeps service-layer typing explicit between lean objects and live documents.
 */
export type ReservationDocument =
    Document<unknown, {}, ReservationSchemaFields> &
    ReservationSchemaFields;
