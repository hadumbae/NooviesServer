import {Types} from "mongoose";
import type ILocation from "../../../shared/model/location/ILocation.js";

/**
 * Interface representing a theatre where movies are shown.
 */
export default interface ITheatre {
    /**
     * The unique identifier for the theatre document.
     */
    _id: Types.ObjectId;

    /**
     * The human‑readable name of the theatre.
     */
    name: string;

    /**
     * The total number of seats available in this theatre.
     */
    seatCapacity: number;

    /**
     * The physical location details of the theatre.
     */
    location: ILocation;
}