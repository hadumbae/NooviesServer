import {CoordinateSchema, LocationSchema} from "./Location.schema.js";
import {z} from "zod";

/**
 * The inferred TypeScript type for a GeoJSON Point coordinate pair,
 * matching the CoordinateSchema:
 * - type: "Point"
 * - coordinates: [longitude, latitude]
 */
export type Coordinates = z.infer<typeof CoordinateSchema>;

/**
 * The inferred TypeScript type for a physical location,
 * matching the LocationSchema:
 * - street?: string
 * - city: string
 * - state?: string
 * - country: string (ISO 3166-1 alpha-2 code)
 * - postalCode?: string
 * - timezone: string (IANA timezone)
 * - coordinates?: Coordinates
 */
export type Location = z.infer<typeof LocationSchema>;