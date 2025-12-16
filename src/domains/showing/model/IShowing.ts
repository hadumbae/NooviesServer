import { Types } from "mongoose";
import type { IScreen } from "../../screen/interface/IScreen.js";
import type IMovie from "../../movie/model/Movie.interface.js";
import type { ShowingStatusCode } from "../schema/ShowingStatusEnumSchema.js";
import type {TheatreSchemaFields} from "../../theatre/model/Theatre.types.js";

/**
 * Represents a movie showing within a theatre.
 *
 * @description
 * Contains scheduling information, pricing, language options,
 * references to the movie, theatre, and screen, as well as
 * seating and status information. This interface is used
 * throughout the system to type-check showings.
 */
export default interface IShowing {
    /**
     * Unique identifier for the showing.
     */
    readonly _id: Types.ObjectId;

    /**
     * The scheduled start time of the showing.
     */
    startTime: Date;

    /**
     * The scheduled end time of the showing.
     *
     * @remarks
     * Can be null if the end time is not predetermined.
     */
    endTime?: Date | null;

    /**
     * The price of a ticket for this showing.
     */
    ticketPrice: number;

    /**
     * The primary language in which the movie is presented.
     */
    language: string;

    /**
     * A list of subtitle languages available for the showing.
     */
    subtitleLanguages: string[];

    /**
     * Indicates whether the showing is currently active
     * and available for booking.
     */
    isActive: boolean;

    /**
     * Indicates whether the showing is a special event
     * (e.g., premiere, themed screening).
     */
    isSpecialEvent: boolean;

    /**
     * Reference to the movie being shown.
     *
     * @remarks
     * Can be either the movie's ObjectId or the full `IMovie` object.
     */
    movie: Types.ObjectId | IMovie;

    /**
     * Reference to the theatre where the showing takes place.
     *
     * @remarks
     * Can be either the theatre's ObjectId or the full `TheatreSchemaFields` object.
     */
    theatre: Types.ObjectId | TheatreSchemaFields;

    /**
     * Reference to the screen on which the movie is shown.
     *
     * @remarks
     * Can be either the screen's ObjectId or the full `IScreen` object.
     */
    screen: Types.ObjectId | IScreen;

    /**
     * Current status of the showing.
     *
     * @remarks
     * Must be one of the allowed `ShowingStatusCode` values.
     */
    status: ShowingStatusCode;
}
