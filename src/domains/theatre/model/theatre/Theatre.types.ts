/**
 * @fileoverview Field definitions for the Theatre entity.
 * Represents a physical cinema venue, encompassing its branding,
 * total capacity metrics, and geographic coordinates.
 */

import {Types} from "mongoose";
import type {LocationSchemaFields} from "@shared/model/location/LocationSchemaFields";
import type {BaseModelWithSlug} from "@shared/types/schema/BaseModel";
import type {ModelTimestamps} from "@shared/types/schema/ModelTimestamps";

/**
 * Type representing the structure of a Theatre document in MongoDB.
 */
export type TheatreSchemaFields = BaseModelWithSlug & ModelTimestamps & {
    _id: Types.ObjectId;
    name: string;
    seatCapacity: number;
    location: LocationSchemaFields;
    slug: string;
}