/**
 * @fileoverview Mongoose schema definition for Reserved Showing snapshots.
 * Implements a "Deep Snapshot" pattern to lock in all showing variables—from movie
 * metadata to specific seat geometry—ensuring transaction records remain
 * immutable and historically accurate.
 */

import { Schema, type SchemaDefinitionProperty } from "mongoose";
import type { ReservedShowingSnapshotSchemaFields } from "./ReservedShowingSnapshot.types.js";
import { ReservationTypeConstant } from "@domains/reservation/constants";
import ISO6391CodeConstant from "@shared/constants/language/ISO6391CodeConstant";
import { MovieSnapshotSchema } from "@domains/movie/model/movie-snapshot/MovieSnapshot.schema";
import { ReservedSeatSnapshotSchema } from "@domains/seatmap/model/seat-map-snapshot/ReservedSeatSnapshot.schema";
import { ScreenSnapshotSchema } from "@domains/screen/models/screen-snapshot";
import {TheatreSnapshotSchema} from "@domains/theatre/model/theatre-snapshot";

/**
 * Reusable ISO 639-1 language field definition.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: {
        values: ISO6391CodeConstant,
        message: "{VALUE} is not a valid ISO-639-1 language code."
    },
    required: [true, "Language code is required."],
};

/**
 * Reserved Showing Snapshot Schema.
 */
export const ReservedShowingSnapshotSchema =
    new Schema<ReservedShowingSnapshotSchemaFields>({
        movie: {
            type: MovieSnapshotSchema,
            required: [true, "Movie snapshot is required."],
        },

        theatre: {
            type: TheatreSnapshotSchema,
            required: [true, "Theatre snapshot is required."],
        },

        screen: {
            type: ScreenSnapshotSchema,
            required: [true, "Screen snapshot is required."],
        },

        selectedSeats: {
            type: [ReservedSeatSnapshotSchema],
            validate: {
                message: "Seating array must be non-empty when provided.",
                validator: (arr: unknown) =>
                    arr === null ||
                    arr === undefined ||
                    (Array.isArray(arr) && arr.length > 0),
            },
        },

        startTime: {
            type: Date,
            required: [true, "Start time is required."],
        },

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

        language: LanguageDefinition,

        subtitleLanguages: {
            type: [LanguageDefinition],
            validate: {
                validator: (langs: unknown) =>
                    Array.isArray(langs) && langs.length > 0,
                message: "At least one subtitle language (or 'None') must be specified.",
            },
            required: [true, "Subtitle languages are required."],
        },

        ticketCount: {
            type: Number,
            min: [1, "Ticket count must be at least 1."],
            required: [true, "Ticket count is required."],
        },

        isSpecialEvent: {
            type: Boolean,
            default: false,
        },

        pricePaid: {
            type: Number,
            min: [0.01, "Price paid must be a positive value."],
            required: [true, "Final price paid is required for audit integrity."],
        },

        reservationType: {
            type: String,
            enum: {
                values: ReservationTypeConstant,
                message: "{VALUE} is not a valid reservation type.",
            },
            required: [true, "Reservation type is required."],
        },
    }, {
        _id: false,
        timestamps: false
    });