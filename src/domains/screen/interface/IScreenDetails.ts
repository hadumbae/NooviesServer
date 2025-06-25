import type ISeat from "../../seat/model/ISeat.js";
import type IShowing from "../../showing/model/IShowing.js";
import type {IScreen} from "./IScreen.js";
import type ITheatre from "../../theatre/model/ITheatre.js";

/**
 * Extended interface of `IScreen` that includes full relational details
 * such as populated theatre, seat, and showing data.
 */
export interface IScreenDetails extends IScreen {
    /**
     * The full theatre object that owns this screen.
     */
    theatre: ITheatre;

    /**
     * List of all seats available in this screen.
     */
    seats: ISeat[];

    /**
     * List of showings (movie sessions) scheduled in this screen.
     */
    showings: IShowing[];
}
