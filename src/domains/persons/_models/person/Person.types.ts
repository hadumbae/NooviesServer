/**
 * @fileoverview Persistence model schema definitions for Person entities.
 */

import {Types} from "mongoose";
import type {ISO3166Alpha2CountryCode} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import type {CloudinaryImageObject} from "@/shared/schema/cloudinary/CloudinaryImageObjectSchema";
import type {BaseModelWithSlug} from "@/shared/_types/model/BaseModel";
import type {ModelTimestamps} from "@/shared/_types/model/ModelTimestamps";

/** Shape of a Person document in MongoDB. */
export type PersonSchemaFields = BaseModelWithSlug & ModelTimestamps & {
    readonly _id: Types.ObjectId;
    name: string;
    biography: string;
    dob: Date;
    nationality: ISO3166Alpha2CountryCode;
    profileImage?: CloudinaryImageObject | null;
    slug: string;
}