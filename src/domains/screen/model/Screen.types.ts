import { Types } from "mongoose";
import type { ScreenTypeEnumType } from "../schema/enum/ScreenTypeEnum.js";
import type { TheatreSchemaFields } from "../../theatre/model/Theatre.types.js";

/**
 * @summary
 * Schema fields for a cinema screen within a theatre.
 *
 * @description
 * Represents an individual screening room, including its capacity,
 * screen technology type, owning theatre, and URL-safe identifier.
 */
export interface ScreenSchemaFields {
    /**
     * Unique MongoDB identifier for the screen.
     */
    readonly _id: Types.ObjectId;

    /**
     * Human-readable display name of the screen.
     *
     * @example "Screen 1"
     * @example "IMAX Hall"
     */
    name: string;

    /**
     * Total seating capacity of the screen.
     *
     * Must be a non-negative integer.
     */
    capacity: number;

    /**
     * Screen technology or format.
     *
     * @example "STANDARD"
     * @example "IMAX"
     * @example "THREE_D"
     */
    screenType: ScreenTypeEnumType;

    /**
     * Theatre this screen belongs to.
     *
     * May be an ObjectId or a populated {@link TheatreSchemaFields} document.
     */
    theatre: Types.ObjectId | TheatreSchemaFields;

    /**
     * URL-safe unique identifier for routing and lookups.
     */
    slug: string;
}
