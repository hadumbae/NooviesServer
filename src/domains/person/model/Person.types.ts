/**
 * @fileoverview Type definition for the Person persistence model.
 */

import {Types} from "mongoose";
import type {ISO3166Alpha2CountryCode} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import type {CloudinaryImageObject} from "@shared/schema/cloudinary/CloudinaryImageObjectSchema";
import type {BaseModelWithSlug} from "@shared/types/schema/BaseModel";
import type {ModelTimestamps} from "@shared/types/schema/ModelTimestamps";

/**
 * Shape of a Person document in MongoDB (cast, crew, etc.).
 */
export type PersonSchemaFields = BaseModelWithSlug & ModelTimestamps & {
    /** Unique MongoDB identifier. */
    readonly _id: Types.ObjectId;

    /** Full display name. */
    name: string;

    /** Biography or professional summary. */
    biography: string;

    /** Date of birth. */
    dob: Date;

    /** Nationality (ISO 3166-1 alpha-2). */
    nationality: ISO3166Alpha2CountryCode;

    /** Representative profile image metadata. */
    profileImage?: CloudinaryImageObject | null;

    /** URL-safe unique identifier. */
    slug: string;
}