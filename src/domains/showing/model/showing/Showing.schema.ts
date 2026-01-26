/**
 * @file Showing.schema.ts
 *
 * Mongoose schema for the `Showing` model.
 *
 * A Showing represents a scheduled movie screening, including timing,
 * language configuration, pricing, lifecycle status, and references
 * to related entities (Movie, Theatre, Screen).
 */

import { Schema, type SchemaDefinitionProperty } from "mongoose";
import ShowingStatusConstant from "../../constants/ShowingStatusConstant.js";
import ISO6391CodeConstant from "../../../../shared/constants/language/ISO6391CodeConstant.js";
import type { ShowingSchemaFields } from "./Showing.types.js";
import SlugSchemaTypeOptions from "../../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * ISO-639-1 language field definition.
 *
 * Used by both `language` and `subtitleLanguages`.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: { values: ISO6391CodeConstant, message: "Invalid ISO-639-1 code." },
    required: [true, "Required."],
};

/**
 * Showing collection schema.
 */
export const ShowingSchema = new Schema<ShowingSchemaFields>(
    {
        /** Referenced Movie document. */
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },

        /** Referenced Theatre document. */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: true,
        },

        /** Referenced Screen document. */
        screen: {
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: true,
        },

        /** Scheduled start time. */
        startTime: {
            type: Date,
            required: [true, "Start Time is required."],
        },

        /**
         * Scheduled end time.
         *
         * Must be later than `startTime` when provided.
         */
        endTime: {
            type: Date,
            default: null,
            validate: {
                validator(value: Date | null | undefined) {
                    return !value || value > this.startTime;
                },
                message: "End Time must be later than Start Time.",
            },
        },

        /** Ticket price for the showing. */
        ticketPrice: {
            type: Number,
            min: [0.01, "Ticket Price must be greater than 0."],
            required: true,
        },

        /** Primary spoken language. */
        language: LanguageDefinition,

        /** Available subtitle languages. */
        subtitleLanguages: {
            type: [LanguageDefinition],
            validate: {
                validator(langs) {
                    return Array.isArray(langs) && langs.length > 0;
                },
                message: "Must be a non-empty array of ISO-639-1 codes.",
            },
            required: [true, "Subtitle languages are required."],
        },

        /** Special event indicator (e.g. premiere). */
        isSpecialEvent: {
            type: Boolean,
            default: false,
            required: true,
        },

        /** Whether the showing is active and bookable. */
        isActive: {
            type: Boolean,
            default: true,
            required: true,
        },

        /** Lifecycle status of the showing. */
        status: {
            type: String,
            enum: { values: ShowingStatusConstant, message: "Invalid Showing status." },
            required: [true, "Status is required."],
        },

        /** Slug field (normalized / write-protected). */
        slug: SlugSchemaTypeOptions,
    },
    {
        /** Automatically managed timestamps. */
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);
