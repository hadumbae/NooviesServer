/**
 * @file Type definitions for the Showing model.
 * @filename Showing.types.ts
 */

import {Types} from "mongoose";
import type {ScreenSchemaFields}
    from "@domains/screen/models/screen/Screen.types";
import type {ShowingStatusCode}
    from "../../validation/ShowingStatusEnumSchema.js";
import type {TheatreSchemaFields}
    from "@domains/theatre/model/theatre";
import type {ISO6391LanguageCode}
    from "@shared/schema/enums/ISO6391LanguageCodeSchema";
import type {MovieSchemaFields, MovieWithGenres}
    from "../../../movie/model/Movie.types.js";
import type {ShowingConfigSchemaFields}
    from "../showing-config/ShowingConfig.types.js";
import type {LocationSchemaFields} from "@shared/model/location/LocationSchemaFields";
import type {BaseSoftDeleteModel} from "@shared/types/schema/BaseModel";

/**
 * Core schema fields for a theatre showing; inherits {@link BaseSoftDeleteModel}.
 */
export type ShowingSchemaFields = BaseSoftDeleteModel & {
    /** Wall-clock time for the start of the event. */
    startTime: Date;

    /** Optional conclusion time; logic enforced via {@link ShowingSchema}. */
    endTime?: Date | null;

    /** Base cost before taxes or fees. */
    ticketPrice: number;

    /** Primary {@link ISO6391LanguageCode}. */
    language: ISO6391LanguageCode;

    /** Collection of {@link ISO6391LanguageCode} for captions/subtitles. */
    subtitleLanguages: ISO6391LanguageCode[];

    /** Reference to {@link MovieSchemaFields}. */
    movie: Types.ObjectId;

    /** Reference to {@link TheatreSchemaFields}. */
    theatre: Types.ObjectId;

    /** Reference to {@link ScreenSchemaFields}. */
    screen: Types.ObjectId;

    /** Lifecycle state via {@link ShowingStatusCode}. */
    status: ShowingStatusCode;

    /** Behavioral flags via {@link ShowingConfigSchemaFields}. */
    config: ShowingConfigSchemaFields;

    /** Snapshot of {@link LocationSchemaFields} at time of creation. */
    location: LocationSchemaFields;

    /** Unique human-readable identifier. */
    slug: string;
}

/**
 * Representation of a showing with joined {@link TheatreSchemaFields}, {@link ScreenSchemaFields}, and {@link MovieWithGenres}.
 */
export type PopulatedShowing = Omit<ShowingSchemaFields, "theatre" | "screen" | "movie"> & {
    theatre: TheatreSchemaFields;
    screen: ScreenSchemaFields;
    movie: MovieWithGenres;
}