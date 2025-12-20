/**
 * @file ShowingSnapshot.schema.ts
 *
 * @summary
 * Mongoose schema for an immutable movie showing snapshot.
 *
 * @description
 * Defines the persisted snapshot of a showing at a specific point in time.
 * All referenced entities (movie, theatre, screen, seat) are embedded as
 * snapshots to ensure historical integrity if source data changes later.
 *
 * This schema is intended for embedding in:
 * - Reservations
 * - Tickets
 * - Booking records
 * - Audit / history documents
 */

import { Schema, type SchemaDefinitionProperty } from "mongoose";
import type { ShowingSnapshotSchemaFields } from "./ShowingSnapshot.types.js";
import { MovieSnapshotSchema } from "../../../movie/model/movie-snapshot/MovieSnapshot.schema.js";
import { TheatreSnapshotSchema } from "../../../theatre/model/theatre-snapshot/TheatreSnapshot.schema.js";
import { SeatSnapshotSchema } from "../../../seat/model/seat-snapshot/SeatSnapshot.model.js";
import { ScreenSnapshotSchema } from "../../../screen/model/screen-snapshot/ScreenSnapshot.schema.js";
import ISO6391CodeConstant from "../../../../shared/constants/language/ISO6391CodeConstant.js";

/**
 * Reusable ISO-639-1 language field definition.
 *
 * Ensures:
 * - Valid ISO-639-1 language codes
 * - Required presence when applied
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: { values: ISO6391CodeConstant, message: "Invalid ISO-6391 Code." },
    required: [true, "Required."],
};

/**
 * Mongoose schema defining a showing snapshot.
 *
 * @remarks
 * - Embedded snapshot documents are assumed immutable
 * - Time and pricing fields are validated at write time
 * - `endTime`, if provided, must be later than `startTime`
 *
 * @example
 * ```ts
 * {
 *   startTime: new Date("2025-01-01T19:30:00Z"),
 *   ticketPrice: 12.5,
 *   language: "en",
 *   subtitleLanguages: ["en", "zh"],
 *   isSpecialEvent: false
 * }
 * ```
 */
export const ShowingSnapshotSchema = new Schema<ShowingSnapshotSchemaFields>({
    /** Snapshot of the movie being shown */
    movie: MovieSnapshotSchema,

    /** Snapshot of the hosting theatre */
    theatre: TheatreSnapshotSchema,

    /** Snapshot of the seat configuration */
    seat: SeatSnapshotSchema,

    /** Snapshot of the screen used */
    screen: ScreenSnapshotSchema,

    /** Scheduled start time of the showing */
    startTime: {
        type: Date,
        required: [true, "Start Time is required."],
    },

    /** Optional scheduled end time (must be after start time) */
    endTime: {
        type: Date,
        default: null,
        validate: {
            validator: function (value: Date | null | undefined) {
                return !value || value > this.startTime;
            },
            message: "The End Time must be later than the Start Time.",
        },
    },

    /** Base ticket price at the time of the showing */
    ticketPrice: {
        type: Number,
        min: [0.01, "Ticket Price must be greater than 0."],
        required: true,
    },

    /** Primary spoken language of the movie */
    language: LanguageDefinition,

    /** Available subtitle languages (ISO-639-1 codes) */
    subtitleLanguages: {
        type: [LanguageDefinition],
        validate: {
            validator: function (langs) {
                return Array.isArray(langs) && langs.length > 0;
            },
            message: "Must be an array of ISO-6391 codes.",
        },
        required: [true, "Subtitle array is required."],
    },

    /** Indicates whether this showing is marked as a special event */
    isSpecialEvent: {
        type: Boolean,
        default: false,
        required: true,
    },
});
