/**
 * @fileoverview Data structure definitions for the Theatre entity.
 */

import { Types } from "mongoose";
import type { LocationSchemaFields } from "@shared/model/location/LocationSchemaFields";
import type { BaseModelWithSlug } from "@shared/types/schema/BaseModel";
import type { ModelTimestamps } from "@shared/types/schema/ModelTimestamps";

/**
 * Structure of a Theatre document including branding, capacity, and location data.
 */
export type TheatreSchemaFields = BaseModelWithSlug & ModelTimestamps & {
    _id: Types.ObjectId;
    name: string;
    seatCapacity: number;
    location: LocationSchemaFields;
    slug: string;
}

/**
 * Extended Theatre type including computed metrics for screens, seats, and future showings.
 */
export type TheatreWithVirtuals = TheatreSchemaFields & {
    screenCount: number;
    seatCount: number;
    futureShowingCount: number;
}