import { Schema, type SchemaDefinitionProperty } from "mongoose";
import ShowingStatusConstant from "../constants/ShowingStatusConstant.js";
import ISO6391CodeConstant from "../../../shared/constants/language/ISO6391CodeConstant.js";
import type {ShowingSchemaFields} from "./Showing.types.js";

/**
 * @fileoverview
 * Defines the Mongoose schema for the `Showing` model.
 *
 * @description
 * A `Showing` represents a scheduled movie screening within a theatre,
 * including its timing, language options, pricing, and related entities
 * such as the movie, theatre, and screen.
 *
 * The schema enforces data integrity through validation rules
 * and value constraints for fields like language codes, pricing,
 * and start/end times.
 */

/**
 * Schema definition for a language field.
 *
 * @remarks
 * Used for both `language` and `subtitleLanguages` properties.
 * Validates that the value conforms to a valid ISO-639-1 code.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: { values: ISO6391CodeConstant, message: "Invalid ISO-6391 Code." },
    required: [true, "Required."],
};

/**
 * The `ShowingSchema` defines the structure and validation
 * of the `Showing` collection in MongoDB.
 */
export const ShowingSchema = new Schema<ShowingSchemaFields>(
    {
        /**
         * Reference to the movie being shown.
         * Must correspond to a valid `Movie` document.
         */
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },

        /**
         * Reference to the theatre where the showing takes place.
         * Must correspond to a valid `Theatre` document.
         */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: true,
        },

        /**
         * Reference to the screen on which the movie is shown.
         * Must correspond to a valid `Screen` document.
         */
        screen: {
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: true,
        },

        /**
         * The scheduled start time of the showing.
         * Required and must be a valid date.
         */
        startTime: {
            type: Date,
            required: [true, "Start Time is required."],
        },

        /**
         * The scheduled end time of the showing.
         *
         * @remarks
         * - Can be `null` if not predetermined.
         * - Must be later than the start time if provided.
         */
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

        /**
         * The price of a ticket for this showing.
         * Must be a positive number greater than 0.
         */
        ticketPrice: {
            type: Number,
            min: [0.01, "Ticket Price must be greater than 0."],
            required: true,
        },

        /**
         * The primary language in which the movie is shown.
         * Must be a valid ISO-639-1 code.
         */
        language: LanguageDefinition,

        /**
         * A list of subtitle languages available for the showing.
         * Must be a non-empty array of valid ISO-639-1 codes.
         */
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

        /**
         * Indicates whether the showing is a special event,
         * such as a premiere or limited-time screening.
         */
        isSpecialEvent: {
            type: Boolean,
            default: false,
            required: true,
        },

        /**
         * Indicates whether the showing is currently active and
         * available for ticket booking.
         */
        isActive: {
            type: Boolean,
            default: true,
            required: true,
        },

        /**
         * The current status of the showing.
         * Must be one of the predefined `ShowingStatusConstant` values.
         */
        status: {
            type: String,
            enum: { values: ShowingStatusConstant, message: "Invalid Showing Status." },
            required: [true, "Status is required."],
        },
    },
    {
        /**
         * Automatically manages `createdAt` and `updatedAt` timestamps.
         */
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
