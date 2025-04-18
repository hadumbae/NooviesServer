import {Types} from "mongoose";
import type {IScreen} from "../../screen/interface/IScreen.js";
import type ITheatre from "../../theatre/model/ITheatre.js";
import type ISeatMap from "../../seatmap/model/ISeatMap.js";
import type IMovie from "../../movie/model/IMovie.js";

/**
 * Represents a movie showing within a theatre.
 *
 * Includes scheduling details, pricing, language options, and references to related entities.
 */
export default interface IShowing {
    /**
     * Unique identifier for the showing.
     */
    readonly _id: Types.ObjectId,

    /**
     * The scheduled start time of the showing.
     */
    startTime: Date;

    /**
     * The scheduled end time of the showing.
     * Can be null if the end time is not predetermined.
     */
    endTime?: Date | null;

    /**
     * The price of a ticket for the showing.
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
     * Indicates whether the showing is currently active and available for booking.
     */
    isActive: boolean;

    /**
     * Indicates whether the showing is a special event (e.g., premiere, themed screening).
     */
    isSpecialEvent: boolean;

    /**
     * Reference to the movie being shown.
     * Can be either the movie's ObjectId or the full `Movie` object.
     */
    movie: Types.ObjectId | IMovie;

    /**
     * Reference to the theatre where the showing takes place.
     * Can be either the theatre's ObjectId or the full `Theatre` object.
     */
    theatre: Types.ObjectId | ITheatre;

    /**
     * Reference to the screen on which the movie is shown.
     * Can be either the screen's ObjectId or the full `Screen` object.
     */
    screen: Types.ObjectId | IScreen;

    /**
     * An array representing the seating arrangement for the showing.
     */
    seating: ISeatMap[];
}