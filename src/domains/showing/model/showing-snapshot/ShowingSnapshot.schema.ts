/**
 * @file ShowingSnapshot.schema.ts
 *
 * @description
 * Mongoose schema for an immutable movie showing snapshot.
 *
 * All referenced entities (movie, theatre, screen, seating) are embedded as
 * snapshots to preserve historical integrity when source data changes.
 *
 * Intended for embedding in:
 * - Reservations
 * - Tickets
 * - Booking records
 * - Audit / history documents
 */

import { Schema, type SchemaDefinitionProperty } from "mongoose";
import type { ShowingSnapshotSchemaFields } from "./ShowingSnapshot.types.js";
import { MovieSnapshotSchema } from "../../../movie/model/movie-snapshot/MovieSnapshot.schema.js";
import { TheatreSnapshotSchema } from "../../../theatre/model/theatre-snapshot/TheatreSnapshot.schema.js";
import { ScreenSnapshotSchema } from "../../../screen/model/screen-snapshot/ScreenSnapshot.schema.js";
import ISO6391CodeConstant from "../../../../shared/constants/language/ISO6391CodeConstant.js";
import { SeatMapSnapshotSchema } from "../../../seatmap/model/seat-map-snapshot/SeatMapSnapshot.schema.js";

/**
 * Reusable ISO-639-1 language field definition.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: { values: ISO6391CodeConstant, message: "Invalid ISO-6391 Code." },
    required: [true, "Required."],
};

/**
 * Showing snapshot schema.
 */
export const ShowingSnapshotSchema = new Schema<ShowingSnapshotSchemaFields>({
    movie: {
        type: MovieSnapshotSchema,
        required: [true, "Movie is required."],
    },
    theatre: {
        type: TheatreSnapshotSchema,
        required: [true, "Theatre is required."],
    },
    screen: {
        type: ScreenSnapshotSchema,
        required: [true, "Screen is required."],
    },
    seating: {
        type: [SeatMapSnapshotSchema],
        required: [true, "Seating is required."],
    },
    startTime: {
        type: Date,
        required: [true, "Start Time is required."],
    },
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
    ticketPrice: {
        type: Number,
        min: [0.01, "Ticket Price must be greater than 0."],
        required: true,
    },
    language: LanguageDefinition,
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
    isSpecialEvent: {
        type: Boolean,
        default: false,
        required: [true, "IsSpecialEvent flag is required."],
    },
});
