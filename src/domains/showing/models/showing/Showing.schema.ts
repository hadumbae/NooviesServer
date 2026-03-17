/**
 * @file Mongoose schema for the Showing model.
 * @filename Showing.schema.ts
 */

import {Schema, type SchemaDefinitionProperty} from "mongoose";
import ShowingStatusConstant from "../../constants/ShowingStatusConstant.js";
import ISO6391CodeConstant
    from "../../../../shared/constants/language/ISO6391CodeConstant.js";
import type {ShowingSchemaFields} from "./Showing.types.js";
import SlugSchemaTypeOptions
    from "../../../../shared/model/SlugSchemaTypeOptions.js";
import {ShowingConfigSchema}
    from "../showing-config/ShowingConfig.schema.js";
import {LocationSchema} from "../../../../shared/model/location/Location.js";

/**
 * ISO-639-1 language field definition.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: {values: ISO6391CodeConstant, message: "Invalid ISO-639-1 code."},
    required: [true, "Required."],
};

/**
 * Showing collection schema.
 */
export const ShowingSchema = new Schema<ShowingSchemaFields>(
    {
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },

        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: true,
        },

        screen: {
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: true,
        },

        startTime: {
            type: Date,
            required: [true, "Start Time is required."],
        },

        /** Must be later than `startTime` when provided. */
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

        ticketPrice: {
            type: Number,
            min: [0.01, "Ticket Price must be greater than 0."],
            required: true,
        },

        language: LanguageDefinition,

        /** Must be a non-empty array. */
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

        status: {
            type: String,
            enum: {
                values: ShowingStatusConstant,
                message: "Invalid Showing status.",
            },
            required: [true, "Status is required."],
        },

        config: {
            type: ShowingConfigSchema,
            default: null,
        },

        /** Embedded location data for the showing. */
        location: LocationSchema,

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