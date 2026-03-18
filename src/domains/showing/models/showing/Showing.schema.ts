/**
 * @file Mongoose schema for the Showing model.
 * @filename Showing.schema.ts
 */

import {type Model, Schema, type SchemaDefinitionProperty} from "mongoose";
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
import type {ModelSoftDeleteMethods} from "../../../../shared/types/schema/ModelSoftDelete.js";

/**
 * Mongoose {@link Model} type for Showings.
 * Integrates {@link ShowingSchemaFields} with {@link ModelSoftDeleteMethods}.
 */
export type ShowingModel = Model<ShowingSchemaFields, {}, ModelSoftDeleteMethods<ShowingSchemaFields>>;

/**
 * Shared configuration for {@link ISO6391CodeConstant} fields.
 */
const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: {values: ISO6391CodeConstant, message: "Invalid ISO-639-1 code."},
    required: [true, "Required."],
};

/**
 * Mongoose schema definition for {@link ShowingSchemaFields}.
 * Enforces temporal consistency and soft-delete state.
 */
export const ShowingSchema = new Schema<ShowingSchemaFields, ShowingModel, ModelSoftDeleteMethods<ShowingSchemaFields>>(
    {
        /** Reference to the "Movie" collection. */
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },

        /** Reference to the "Theatre" collection. */
        theatre: {
            type: Schema.Types.ObjectId,
            ref: "Theatre",
            required: true,
        },

        /** Reference to the "Screen" collection. */
        screen: {
            type: Schema.Types.ObjectId,
            ref: "Screen",
            required: true,
        },

        /** Commencement time. Anchor for {@link endTime} validation. */
        startTime: {
            type: Date,
            required: [true, "Start Time is required."],
        },

        /** Must be strictly later than {@link startTime}. */
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

        /** Cost per seat via {@link Number}. */
        ticketPrice: {
            type: Number,
            min: [0.01, "Ticket Price must be greater than 0."],
            required: true,
        },

        /** Audio {@link LanguageDefinition}. */
        language: LanguageDefinition,

        /** Caption/subtitle {@link LanguageDefinition} array. */
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

        /** Operational state via {@link ShowingStatusConstant}. */
        status: {
            type: String,
            enum: {
                values: ShowingStatusConstant,
                message: "Invalid Showing status.",
            },
            required: [true, "Status is required."],
        },

        /** Feature flags via {@link ShowingConfigSchema}. */
        config: {
            type: ShowingConfigSchema,
            required: [true, "Config is required."],
        },

        /** Embedded {@link LocationSchema}. */
        location: LocationSchema,

        /** {@link SlugSchemaTypeOptions} */
        slug: SlugSchemaTypeOptions,

        /** Soft-delete flag via {@link IsDeletedSchemaTypeOptions}. */
        isDeleted: IsDeletedSchemaTypeOptions,

        /** Soft-delete audit via {@link DeletedAtSchemaTypeOptions}. */
        deletedAt: DeletedAtSchemaTypeOptions,
    },
    {
        /** Standard {@link ModelTimestamps}. */
        timestamps: true,
    }
);