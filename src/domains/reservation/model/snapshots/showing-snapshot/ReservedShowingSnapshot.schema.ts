/**
 * @file ReservedShowingSnapshot.schema.ts
 *
 * @description
 * Mongoose schema for an immutable reserved showing snapshot.
 *
 * Captures the finalized state of a showing at reservation time, embedding
 * snapshots of the movie, theatre, screen, and selected seats. This ensures
 * historical and financial integrity if source data changes later.
 *
 * Intended for embedding in:
 * - Reservations
 * - Tickets
 * - Booking records
 * - Audit / history documents
 */

import { Schema, type SchemaDefinitionProperty } from "mongoose";
import type { ReservedShowingSnapshotSchemaFields } from "./ReservedShowingSnapshot.types.js";
import ISO6391CodeConstant from "../../../../../shared/constants/language/ISO6391CodeConstant.js";
import { MovieSnapshotSchema } from "../../../../movie/model/movie-snapshot/MovieSnapshot.schema.js";
import { TheatreSnapshotSchema } from "../../../../theatre/model/theatre-snapshot/TheatreSnapshot.schema.js";
import { ScreenSnapshotSchema } from "../../../../screen/model/screen-snapshot/ScreenSnapshot.schema.js";
import { ReservedSeatSnapshotSchema } from "../seat-map-snapshot/ReservedSeatSnapshot.schema.js";

/** Reusable ISO-639-1 language field definition. */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: { values: ISO6391CodeConstant, message: "Invalid ISO-6391 Code." },
    required: [true, "Required."],
};

/** Reserved showing snapshot schema. */
export const ReservedShowingSnapshotSchema = new Schema<ReservedShowingSnapshotSchemaFields>({
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

    /** Array of selected seats with snapshots at reservation time. */
    selectedSeats: {
        type: [ReservedSeatSnapshotSchema],
        required: [true, "Selected seats are required."],
    },

    /** Scheduled start time of the showing. */
    startTime: {
        type: Date,
        required: [true, "Start Time is required."],
    },

    /** Optional end time; must be later than startTime if present. */
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

    /** Primary spoken language of the showing (ISO-639-1). */
    language: LanguageDefinition,

    /** Subtitle languages available for the showing (ISO-639-1). */
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

    /** Indicates whether the showing is a special event screening. */
    isSpecialEvent: {
        type: Boolean,
    },

    /** Total price paid for the reservation. */
    pricePaid: {
        type: Number,
        min: [0.01, "Price Paid must be greater than 0."],
        required: true,
    },
});
