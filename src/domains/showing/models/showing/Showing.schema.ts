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
import {IsDeletedSchemaTypeOptions} from "../../../../shared/model/IsDeletedSchemaTypeOptions.js";
import {DeletedAtSchemaTypeOptions} from "../../../../shared/model/DeletedAtSchemaTypeOptions.js";

/**
 * Shared configuration for {@link ISO6391CodeConstant} fields.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: {values: ISO6391CodeConstant, message: "Invalid ISO-639-1 code."},
    required: [true, "Required."],
};

/**
 * Mongoose schema for {@link ShowingSchemaFields}.
 * Includes validation for event timing and language requirements.
 */
export const ShowingSchema = new Schema<ShowingSchemaFields>(
    {
        /** Reference to "Movie" collection. */
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },

        /** Reference to "Theatre" collection. */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: true,
        },

        /** Reference to "Screen" collection. */
        screen: {
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: true,
        },

        /** Scheduled commencement time. Used as the anchor for {@link endTime} validation. */
        startTime: {
            type: Date,
            required: [true, "Start Time is required."],
        },

        /** Ensures chronologically valid duration if provided. */
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

        /** Validates positive currency value. */
        ticketPrice: {
            type: Number,
            min: [0.01, "Ticket Price must be greater than 0."],
            required: true,
        },

        /** Primary spoken language. */
        language: LanguageDefinition,

        /** Enforces at least one subtitle selection. */
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

        /** Lifecycle state restricted to {@link ShowingStatusConstant}. */
        status: {
            type: String,
            enum: {
                values: ShowingStatusConstant,
                message: "Invalid Showing status.",
            },
            required: [true, "Status is required."],
        },

        /** Embedded {@link ShowingConfigSchema}. */
        config: {
            type: ShowingConfigSchema,
            required: [true, "Config is required."],
        },

        /** Snapshot via {@link LocationSchema}. */
        location: LocationSchema,

        /** {@link SlugSchemaTypeOptions} */
        slug: SlugSchemaTypeOptions,

        /** Soft-delete toggle via {@link IsDeletedSchemaTypeOptions}. */
        isDeleted: IsDeletedSchemaTypeOptions,

        /** Soft-delete timestamp via {@link DeletedAtSchemaTypeOptions}. */
        deletedAt: DeletedAtSchemaTypeOptions,
    },
    {
        /** Managed {@link ModelTimestamps}. */
        timestamps: true,
    }
);