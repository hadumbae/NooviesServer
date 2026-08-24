/**
 * @fileoverview Zod schemas and TypeScript types for location coordinate validation and geographic position representations.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "../strings/NonEmptyStringSchema.js";
import {IANATimezoneSchema} from "../date-time/IANATimezoneSchema.js";
import {ISO3166Alpha2CountryCodeSchema} from "../enums/ISO3166Alpha2CountryCodeSchema.js";
import {NumberValueSchema} from "@/shared/_schema/numbers/numbers/NumberValueSchema";
import {CityStringSchema, StateStringSchema, StreetStringSchema} from "@/shared/_schema";

/** Schema for validating longitude geographic coordinates within valid world bounds. */
export const LongitudeSchema = NumberValueSchema
    .min(-180, {message: "Longitude must be greater than or equal -180."})
    .max(180, {message: "Longitude must be less than or equal 180."});

/** Schema for validating latitude geographic coordinates within valid world bounds. */
export const LatitudeSchema = NumberValueSchema
    .min(-90, {message: "Latitude must be greater than or equal -90."})
    .max(90, {message: "Latitude must be less than or equal 90."});

/** Schema for validating GeoJSON Point objects with coordinate pairs. */
export const CoordinateSchema = z.object({
    type: z.literal("Point").describe("GeoJSON geometry type; must be `Point`."),
    coordinates: z.tuple(
        [LongitudeSchema, LatitudeSchema],
        {
            required_error: "Required!",
            invalid_type_error: "Invalid coordinates. Must be an array of two coordinate points.",
            message: "Invalid coordinates.",
        },
    ).describe("[longitude, latitude]"),
});

/** Schema for validating physical address structures with optional geospatial positioning. */
export const LocationSchema = z.object({
    street: StreetStringSchema.optional(),
    city: CityStringSchema,
    state: StateStringSchema.optional(),
    country: ISO3166Alpha2CountryCodeSchema,
    postalCode: NonEmptyStringSchema.optional(),
    timezone: IANATimezoneSchema,
    coordinates: CoordinateSchema.optional(),
});