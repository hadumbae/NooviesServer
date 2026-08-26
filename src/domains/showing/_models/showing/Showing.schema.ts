/**
 * @fileoverview Defines the Mongoose schema and model for movie showings.
 */

import {type Model, Schema, type SchemaDefinitionProperty} from "mongoose";
import {ShowingStatusConstant} from "@/domains/showing/_validation/fields/ShowingStatusConstant";
import ISO6391CodeConstant from "@/shared/constants/language/ISO6391CodeConstant.js";
import type {ShowingSchemaFields} from "./Showing.types.js";
import SlugSchemaTypeOptions from "@/shared/model/SlugSchemaTypeOptions.js";
import {ShowingConfigSchema} from "@/domains/showing/_models/showing-config/ShowingConfig.schema.js";
import {LocationSchema} from "@/shared/model/location/Location.js";
import {IsDeletedSchemaTypeOptions} from "@/shared/model/IsDeletedSchemaTypeOptions.js";
import {DeletedAtSchemaTypeOptions} from "@/shared/model/DeletedAtSchemaTypeOptions.js";
import type {ModelSoftDeleteMethods} from "@/shared/_types/model/ModelSoftDelete";
import {IANAZone} from "luxon";

/** Mongoose model type for the Showing collection including soft-delete methods. */
export type ShowingModel = Model<ShowingSchemaFields, {}, ModelSoftDeleteMethods<ShowingSchemaFields>>;

const LanguageDefinition: SchemaDefinitionProperty = {
    type: String,
    enum: {values: ISO6391CodeConstant, message: "Invalid ISO-639-1 code."},
    required: [true, "Required."],
};

/** Mongoose schema definition for movie showings. */
export const ShowingSchema = new Schema<ShowingSchemaFields, ShowingModel, ModelSoftDeleteMethods<ShowingSchemaFields>>(
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

        timezone: {
            type: String,
            required: [true, "`Timezone` is required."],
            validate: {
                validator: (value: any) => IANAZone.isValidZone(value),
                message: (props: any) => `Invalid timezone. Received: ${props.value}`,
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
            required: [true, "Config is required."],
        },

        location: LocationSchema,

        slug: SlugSchemaTypeOptions,

        isDeleted: IsDeletedSchemaTypeOptions,

        deletedAt: DeletedAtSchemaTypeOptions,
    },
    {
        timestamps: true,
    }
);