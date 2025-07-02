import {Types} from "mongoose";
import type ITheatre from "../../theatre/model/ITheatre.js";
import type {IScreen} from "../../screen/interface/IScreen.js";
import type ISeatBase from "./ISeatBase.js";

/**
 * Interface representing a seat with its associated screen and theatre.
 * Extends the base seat properties from ISeatBase.
 */
export default interface ISeat extends ISeatBase {
    /**
     * The screen (or its ObjectId) this seat belongs to.
     */
    screen: Types.ObjectId | IScreen;

    /**
     * The theatre (or its ObjectId) this seat belongs to.
     */
    theatre: Types.ObjectId | ITheatre;
}