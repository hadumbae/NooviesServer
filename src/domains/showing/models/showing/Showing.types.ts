/**
 * @file Type definitions for the Showing model.
 * @filename Showing.types.ts
 */

import { Types } from "mongoose";
import type { ScreenSchemaFields }
    from "../../../screen/model/Screen.types.js";
import type { ShowingStatusCode }
    from "../../validation/ShowingStatusEnumSchema.js";
import type { TheatreSchemaFields }
    from "../../../theatre/model/Theatre.types.js";
import type { ISO6391LanguageCode }
    from "../../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type { MovieSchemaFields, MovieWithGenres }
    from "../../../movie/model/Movie.types.js";
import type { ShowingConfigSchemaFields }
    from "../showing-config/ShowingConfig.types.js";

/**
 * Core showing fields.
 */
export interface ShowingSchemaFields {
    readonly _id: Types.ObjectId;

    startTime: Date;

    /** Must be later than `startTime` when provided. */
    endTime?: Date | null;

    ticketPrice: number;

    language: ISO6391LanguageCode;

    /** Must contain at least one language. */
    subtitleLanguages: ISO6391LanguageCode[];

    /** ID or populated movie. */
    movie: Types.ObjectId | MovieSchemaFields;

    /** ID or populated theatre. */
    theatre: Types.ObjectId | TheatreSchemaFields;

    /** ID or populated screen. */
    screen: Types.ObjectId | ScreenSchemaFields;

    status: ShowingStatusCode;

    /** Optional configuration flags. */
    config?: ShowingConfigSchemaFields | null;

    slug: string;
}

/**
 * Showing with populated relations.
 */
export interface PopulatedShowing extends ShowingSchemaFields {
    theatre: TheatreSchemaFields;
    screen: ScreenSchemaFields;
    movie: MovieWithGenres;
}