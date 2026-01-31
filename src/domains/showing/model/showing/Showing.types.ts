/**
 * @file Showing.types.ts
 *
 * Schema field definitions for a live movie showing.
 *
 * Represents the **mutable, operational state** of a showing.
 * References related domain entities (movie, theatre, screen)
 * by ID or populated document and reflects current scheduling,
 * pricing, language, and lifecycle state.
 *
 * For historical or transactional records (e.g. reservations,
 * tickets, reporting), snapshot-based schemas should be used
 * to prevent data drift.
 */

import { Types } from "mongoose";
import type { ScreenSchemaFields }
    from "../../../screen/model/Screen.types.js";
import type { ShowingStatusCode }
    from "../../schema/ShowingStatusEnumSchema.js";
import type { TheatreSchemaFields }
    from "../../../theatre/model/Theatre.types.js";
import type { ISO6391LanguageCode }
    from "../../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";
import type { MovieSchemaFields, MovieWithGenres }
    from "../../../movie/model/Movie.types.js";
import type { ShowingConfigSchemaFields }
    from "../showing-config/ShowingConfig.types.js";

/**
 * Live showing schema fields.
 *
 * Designed for scheduling, administration, and runtime operations
 * where referenced entities may evolve independently over time.
 */
export interface ShowingSchemaFields {
    /** Unique identifier for the showing. */
    readonly _id: Types.ObjectId;

    /** Scheduled start time of the showing. */
    startTime: Date;

    /**
     * Optional scheduled end time.
     *
     * @remarks
     * When present, must be later than `startTime`.
     */
    endTime?: Date | null;

    /** Base ticket price for the showing. */
    ticketPrice: number;

    /** Primary spoken language (ISO 639-1). */
    language: ISO6391LanguageCode;

    /** Available subtitle languages (ISO 639-1). */
    subtitleLanguages: ISO6391LanguageCode[];

    /** Whether the showing is currently active and bookable. */
    isActive: boolean;

    /** Marks special screenings (e.g. premieres, festivals). */
    isSpecialEvent: boolean;

    /** Referenced movie (ID or populated document). */
    movie: Types.ObjectId | MovieSchemaFields;

    /** Hosting theatre (ID or populated document). */
    theatre: Types.ObjectId | TheatreSchemaFields;

    /** Screen on which the showing is presented (ID or populated document). */
    screen: Types.ObjectId | ScreenSchemaFields;

    /** Current lifecycle status of the showing. */
    status: ShowingStatusCode;

    /**
     * Optional showing-level configuration.
     *
     * @remarks
     * Used for feature flags, overrides, or behavior modifiers
     * specific to this showing instance.
     */
    config?: ShowingConfigSchemaFields | null;

    /** Normalized slug identifier. */
    slug: string;
}

/**
 * Fully populated showing representation.
 *
 * All reference fields are resolved to their corresponding
 * domain objects for read-heavy workflows.
 */
export interface PopulatedShowing extends ShowingSchemaFields {
    theatre: TheatreSchemaFields;
    screen: ScreenSchemaFields;
    movie: MovieWithGenres;
}
