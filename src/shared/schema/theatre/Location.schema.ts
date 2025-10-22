import {z} from "zod";
import {NonEmptyStringSchema} from "../strings/NonEmptyStringSchema.js";
import {IANATimezoneSchema} from "../date-time/IANATimezoneSchema.js";
import {ISO3166Alpha2CountryCodeSchema} from "../enums/ISO3166Alpha2CountryCodeSchema.js";
import {NumberValueSchema} from "../numbers/NumberValueSchema.js";

/**
 * A schema for validating longitude values.
 * Longitude represents the east-west position and must be a number between -180 and 180.
 */
export const LongitudeSchema = NumberValueSchema
    .min(-180, {message: "Longitude must be greater than or equal -180."})
    .max(180, {message: "Longitude must be less than or equal 180."});

/**
 * A schema for validating latitude values.
 * Latitude represents the north-south position and must be a number between -90 and 90.
 */
export const LatitudeSchema = NumberValueSchema
    .min(-90, {message: "Latitude must be greater than or equal -90."})
    .max(90, {message: "Latitude must be less than or equal 90."});

/**
 * A GeoJSON Point schema for validating coordinate pairs.
 * - type: Must be the literal string "Point".
 * - coordinates: A tuple [longitude, latitude] validated by LongitudeSchema and LatitudeSchema.
 */
export const CoordinateSchema = z.object({
    /**
     * The GeoJSON geometry type. Must be "Point" for coordinate pairs.
     */
    type: z.literal("Point").describe("GeoJSON geometry type; must be `Point`."),

    /**
     * The coordinate pair as [longitude, latitude].
     */
    coordinates: z.tuple(
        [LongitudeSchema, LatitudeSchema],
        {
            required_error: "Required!",
            invalid_type_error: "Invalid coordinates. Must be an array of two coordinate points.",
            message: "Invalid coordinates.",
        },
    ).describe("[longitude, latitude]"),
});

/**
 * A schema for validating a physical location.
 * - street: Optional street address (max 2000 chars).
 * - city: Required city name (max 500 chars).
 * - state: Optional state or region (max 500 chars).
 * - country: ISO 3166-1 alpha-2 country code.
 * - postalCode: Optional postal or ZIP code.
 * - timezone: Valid IANA timezone string.
 * - coordinates: Optional GeoJSON Point for geospatial queries.
 */
export const LocationSchema = z.object({
    /**
     * Street address (e.g., "123 Main St").
     */
    street: NonEmptyStringSchema
        .max(2000, { message: "Must be 2000 characters or less." })
        .optional(),

    /**
     * City name (e.g., "Bangkok").
     */
    city: NonEmptyStringSchema
        .max(500, { message: "Must be 500 characters or less." }),

    /**
     * State or region (e.g., "California").
     */
    state: NonEmptyStringSchema
        .max(500, { message: "Must be 500 characters or less." })
        .optional(),

    /**
     * Country code in ISO 3166-1 alpha-2 format (e.g., "US", "TH").
     */
    country: ISO3166Alpha2CountryCodeSchema,

    /**
     * Postal or ZIP code.
     */
    postalCode: NonEmptyStringSchema.optional(),

    /**
     * IANA timezone name (e.g., "Asia/Bangkok").
     */
    timezone: IANATimezoneSchema,

    /**
     * Optional GeoJSON Point for precise geolocation.
     */
    coordinates: CoordinateSchema.optional(),
});

