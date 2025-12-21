/**
 * @file Showing.types.ts
 *
 * @description
 * Schema field definitions for a live movie showing.
 *
 * This interface represents the **mutable, operational state** of a showing.
 * It references other domain entities (movie, theatre, screen) by ID or
 * populated document and reflects the current scheduling, pricing, language,
 * and lifecycle status.
 *
 * For historical or transactional records (e.g. reservations, tickets),
 * use `ShowingSnapshotSchemaFields` instead to prevent data drift.
 */

import { Types } from "mongoose";
import type { IScreen } from "../../screen/interface/IScreen.js";
import type IMovie from "../../movie/model/Movie.interface.js";
import type { ShowingStatusCode } from "../schema/ShowingStatusEnumSchema.js";
import type { TheatreSchemaFields } from "../../theatre/model/Theatre.types.js";
import type { ISO6391LanguageCode } from "../../../shared/schema/enums/ISO6391LanguageCodeSchema.js";

/**
 * Live showing schema fields.
 *
 * Designed for scheduling, administration, and runtime operations where
 * referenced entities may evolve over time.
 */
export interface ShowingSchemaFields {
    /** Unique identifier for the showing. */
    readonly _id: Types.ObjectId;

    /** Scheduled start time of the showing. */
    startTime: Date;

    /** Optional end time; must be later than `startTime` when present. */
    endTime?: Date | null;

    /** Base ticket price for the showing. */
    ticketPrice: number;

    /** Primary spoken language of the showing (ISO-639-1). */
    language: ISO6391LanguageCode;

    /** Available subtitle languages (ISO-639-1). */
    subtitleLanguages: ISO6391LanguageCode[];

    /** Whether the showing is currently active and bookable. */
    isActive: boolean;

    /** Marks special screenings (e.g. premieres, festivals, private events). */
    isSpecialEvent: boolean;

    /** Referenced movie (ID or populated document). */
    movie: Types.ObjectId | IMovie;

    /** Hosting theatre (ID or populated document). */
    theatre: Types.ObjectId | TheatreSchemaFields;

    /** Screen on which the showing is presented (ID or populated document). */
    screen: Types.ObjectId | IScreen;

    /** Current lifecycle status of the showing. */
    status: ShowingStatusCode;
}
