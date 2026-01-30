/**
 * @file ReservedShowingSnapshot.schema.ts
 *
 * Mongoose schema for an immutable reserved showing snapshot.
 *
 * Captures the fully resolved state of a showing at the moment a
 * reservation is created, embedding snapshots of:
 * - Movie
 * - Theatre
 * - Screen
 * - Selected seats (if applicable)
 *
 * @remarks
 * This snapshot is designed to be write-once and never mutated.
 * It guarantees historical, operational, and financial integrity
 * even if upstream source data changes after booking.
 *
 * Intended for embedding in:
 * - Reservations
 * - Tickets
 * - Booking records
 * - Audit and history documents
 */

import { Schema, type SchemaDefinitionProperty } from "mongoose";
import type { ReservedShowingSnapshotSchemaFields } from "./ReservedShowingSnapshot.types.js";
import ISO6391CodeConstant from "../../../../../shared/constants/language/ISO6391CodeConstant.js";
import { MovieSnapshotSchema } from "../../../../movie/model/movie-snapshot/MovieSnapshot.schema.js";
import { TheatreSnapshotSchema } from "../../../../theatre/model/theatre-snapshot/TheatreSnapshot.schema.js";
import { ScreenSnapshotSchema } from "../../../../screen/model/screen-snapshot/ScreenSnapshot.schema.js";
import { ReservedSeatSnapshotSchema } from "../seat-map-snapshot/ReservedSeatSnapshot.schema.js";
import { ReservationTypeConstant } from "../../../constants/ReservationTypeConstant.js";

/**
 * Reusable ISO 639-1 language field definition.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: { values: ISO6391CodeConstant, message: "Invalid ISO-639-1 code." },
    required: [true, "Required."],
};

/**
 * Reserved showing snapshot schema.
 *
 * @remarks
 * All fields represent a point-in-time snapshot of the showing
 * and must remain immutable once persisted.
 */
export const ReservedShowingSnapshotSchema =
    new Schema<ReservedShowingSnapshotSchemaFields>({
        /** Embedded movie snapshot at reservation time. */
        movie: {
            type: MovieSnapshotSchema,
            required: [true, "Movie is required."],
        },

        /** Embedded theatre snapshot at reservation time. */
        theatre: {
            type: TheatreSnapshotSchema,
            required: [true, "Theatre is required."],
        },

        /** Embedded screen snapshot at reservation time. */
        screen: {
            type: ScreenSnapshotSchema,
            required: [true, "Screen is required."],
        },

        /**
         * Selected seat snapshots at reservation time.
         *
         * @remarks
         * Present only for {@link ReservationTypeConstant.RESERVED_SEATS}
         * reservations. Must be omitted for general admission.
         */
        selectedSeats: {
            type: [ReservedSeatSnapshotSchema],
            validate: {
                message: "Must be a non-empty array of seats.",
                validator: (arr: unknown) =>
                    arr === null ||
                    arr === undefined ||
                    (Array.isArray(arr) && arr.length > 0),
            },
        },

        /** Scheduled start time of the showing. */
        startTime: {
            type: Date,
            required: [true, "Start time is required."],
        },

        /**
         * Optional scheduled end time.
         *
         * @remarks
         * If present, must be later than {@link startTime}.
         */
        endTime: {
            type: Date,
            default: null,
            validate: {
                validator: function (value: Date | null | undefined) {
                    return !value || value > this.startTime;
                },
                message: "End time must be later than start time.",
            },
        },

        /** Primary spoken language of the showing (ISO 639-1). */
        language: LanguageDefinition,

        /**
         * Subtitle languages available for the showing (ISO 639-1).
         */
        subtitleLanguages: {
            type: [LanguageDefinition],
            validate: {
                validator: (langs: unknown) =>
                    Array.isArray(langs) && langs.length > 0,
                message: "Must be a non-empty array of ISO 639-1 codes.",
            },
            required: [true, "Subtitle languages are required."],
        },

        /** Number of tickets included in the reservation. */
        ticketCount: {
            type: Number,
            min: [1, "Must be 1 or more."],
            required: [true, "Ticket count is required."],
        },

        /** Indicates whether the showing is a special event screening. */
        isSpecialEvent: {
            type: Boolean,
        },

        /** Total price paid for the reservation at booking time. */
        pricePaid: {
            type: Number,
            min: [0.01, "Price paid must be greater than 0."],
            required: true,
        },

        /**
         * Reservation type applied at booking time.
         *
         * @remarks
         * Determines whether seat snapshots are expected or forbidden.
         */
        reservationType: {
            type: String,
            enum: {
                values: ReservationTypeConstant,
                message: "Invalid type value.",
            },
            required: [true, "Type is required for reservation snapshots."],
        },
    });
