import {Types} from "mongoose";
import type {ScreenTypeEnumType} from "../schema/enum/ScreenTypeEnum.js";
import type {TheatreSchemaFields} from "../../theatre/model/Theatre.types.js";

/**
 * Interface representing a cinema screen within a theatre.
 */
export interface IScreen {
    /**
     * Unique identifier for the screen (MongoDB ObjectId).
     */
    readonly _id: Types.ObjectId;

    /**
     * Human-readable name of the screen.
     *
     * Example: "Screen 1", "IMAX Hall"
     */
    name: string;

    /**
     * Seating capacity of the screen. Must be a non-negative integer.
     */
    capacity: number;

    /**
     * Type of screen (e.g., standard, IMAX, 3D), defined by an enum.
     */
    screenType: ScreenTypeEnumType;

    /**
     * Reference to the theatre this screen belongs to.
     * Can be either the theatre's ObjectId or a full TheatreSchemaFields object if populated.
     */
    theatre: Types.ObjectId | TheatreSchemaFields;
}

