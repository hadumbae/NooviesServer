import type {IScreen} from "./IScreen.js";
import type ITheatre from "../../theatre/model/ITheatre.js";

/**
 * Extended interface of `IScreen` that includes enriched details
 * about the theatre it belongs to and aggregated data.
 */
export interface IScreenDetails extends IScreen {
    /** The full theatre object this screen belongs to. */
    theatre: ITheatre;

    /** The total number of seats available in the screen. */
    seatCount: number;

    /** The number of future showings scheduled for this screen. */
    futureShowingCount: number;
}
