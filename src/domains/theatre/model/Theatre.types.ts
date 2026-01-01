import { Types } from "mongoose";
import type ILocation from "../../../shared/model/location/ILocation.js";

/**
 * @file TheatreSchemaFields.ts
 *
 * @summary
 * Core schema fields for Theatre documents.
 *
 * @description
 * Defines the canonical field structure used by the Theatre Mongoose schema,
 * representing a physical cinema venue and its identifying attributes.
 */
export interface TheatreSchemaFields {
    /**
     * Unique MongoDB identifier for the theatre.
     */
    _id: Types.ObjectId;

    /**
     * Human-readable display name of the theatre.
     */
    name: string;

    /**
     * Total seating capacity available in the theatre.
     */
    seatCapacity: number;

    /**
     * Physical location details of the theatre.
     */
    location: ILocation;

    /**
     * URL-safe unique identifier used for routing and lookups.
     */
    slug: string;
}
