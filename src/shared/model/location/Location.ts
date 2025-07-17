import {Schema} from "mongoose";
import type ILocation from "./ILocation.js";
import {CoordinateSchema} from "../coordinate/Coordinate.js";
import {IANAZone} from "luxon";
import ISO3166Alpha2CountryConstant from "../../constants/country/ISO3166Alpha2CountryConstant.js";

/**
 * Mongoose schema for embedding a physical location into documents.
 * Captures address components, ISO country code, timezone, and optional geocoordinates.
 */
export const LocationSchema = new Schema<ILocation>({
    /**
     * Street address line (e.g., "123 Main St").
     * Trimmed and limited to 2000 characters.
     */
    street: {
        type: String,
        trim: true,
        maxlength: [2000, "`Street` must be 2000 letters or less."],
    },

    /**
     * City name (e.g., "Bangkok").
     * Trimmed, required, and limited to 500 characters.
     */
    city: {
        type: String,
        trim: true,
        maxlength: [500, "`City` must be 500 letters or less."],
        required: [true, "`City` is required."],
    },

    /**
     * State or region (e.g., "California").
     * Trimmed and limited to 500 characters.
     */
    state: {
        type: String,
        trim: true,
        maxlength: [500, "`State` must be 500 letters or less."],
    },

    /**
     * Country code as per ISO 3166-1 alpha-2 (e.g., "US", "TH").
     * Required and restricted to the constants in ISO3166Alpha2CountryConstant.
     */
    country: {
        type: String,
        enum: ISO3166Alpha2CountryConstant,
        required: [true, "`Country` is required."],
    },

    /**
     * Postal or ZIP code.
     * Trimmed and limited to 100 characters.
     */
    postalCode: {
        type: String,
        trim: true,
        maxlength: [100, "`Postal Code` must be 100 letters or less."],
    },

    /**
     * IANA timezone name (e.g., "Asia/Bangkok").
     * Required and validated against Luxon's IANAZone database.
     */
    timezone: {
        type: String,
        required: [true, "`Timezone` is required."],
        validate: {
            validator: (value: any) => IANAZone.isValidZone(value),
            message: (props: any) => `Invalid timezone. Received: ${props.value}`,
        },
    },

    /**
     * Optional GeoJSON Point coordinates for geospatial queries.
     * Defined by the standalone CoordinateSchema.
     */
    coordinates: CoordinateSchema,
});