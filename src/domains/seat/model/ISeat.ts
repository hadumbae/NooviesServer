import {Types} from "mongoose";
import type ISeatBase from "./ISeatBase.js";

/**
 * Interface representing a seat with its associated screen and theatre.
 * Extends the base seat properties from ISeatBase.
 */
export default interface ISeat extends ISeatBase {
    /**
     * The ObjectId of the screen this seat belongs to.
     */
    screen: Types.ObjectId;

    /**
     * The ObjectId of the theatre this seat belongs to.
     */
    theatre: Types.ObjectId;
}