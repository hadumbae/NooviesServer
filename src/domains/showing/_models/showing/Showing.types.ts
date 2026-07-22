/**
 * @fileoverview Type definitions for the Showing model.
 */

import {Types} from "mongoose";
import type {ScreenSchemaFields}
    from "@/domains/screen/_models/screen/Screen.types";
import type {ShowingStatusCode}
    from "@/domains/showing/_validation/fields/ShowingStatusSchema";
import type {TheatreSchemaFields}
    from "@/domains/theatre/model/theatre";
import type {ISO6391LanguageCode}
    from "@/shared/schema/enums/ISO6391LanguageCodeSchema";
import type {MovieWithGenres}
    from "@/domains/movies/_models/movie/Movie.types";
import type {ShowingConfigSchemaFields}
    from "@/domains/showing/_models/showing-config/ShowingConfig.types.js";
import type {LocationSchemaFields} from "@/shared/model/location/LocationSchemaFields";
import type {BaseSoftDeleteModel} from "@/shared/_types/model/BaseModel";

/** Core schema fields for a theatre showing. */
export type ShowingSchemaFields = BaseSoftDeleteModel & {
    startTime: Date;
    endTime?: Date | null;
    ticketPrice: number;
    language: ISO6391LanguageCode;
    subtitleLanguages: ISO6391LanguageCode[];
    movie: Types.ObjectId;
    theatre: Types.ObjectId;
    screen: Types.ObjectId;
    status: ShowingStatusCode;
    config: ShowingConfigSchemaFields;
    location: LocationSchemaFields;
    slug: string;
}

/** Representation of a showing with joined theatre, screen, and movie details. */
export type PopulatedShowing = Omit<ShowingSchemaFields, "theatre" | "screen" | "movie"> & {
    theatre: TheatreSchemaFields;
    screen: ScreenSchemaFields;
    movie: MovieWithGenres;
}

/** Representation of a showing with joined movie details. */
export type ShowingWithMovie = Omit<ShowingSchemaFields, "movie"> & {
    movie: MovieWithGenres;
}