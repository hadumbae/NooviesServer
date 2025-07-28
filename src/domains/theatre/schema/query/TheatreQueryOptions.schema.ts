import {z} from "zod";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamNonNegativeNumberSchema} from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import {MongooseSortOrderSchema} from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";
import {IANATimezoneSchema} from "../../../../shared/schema/timezones/IANATimezone.enum.js";
import {ISO3166Alpha2CodeEnumSchema} from "../../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";

/**
 * Schema for filtering theatres by various optional query parameters.
 *
 * This is typically used for matching theatre documents in database queries.
 * All fields are optional and interpreted as **query parameters**.
 *
 * Example use case:
 * - `/api/theatres?city=Bangkok&seatCapacity=200`
 */
export const TheatreMatchFilterSchema = z.object({
    /** Human-readable name of the theatre (partial match supported). */
    name: URLParamStringSchema,

    /** Minimum seat capacity (non-negative integer). */
    seatCapacity: URLParamNonNegativeNumberSchema,

    /** Street address of the theatre. */
    street: URLParamStringSchema,

    /** City where the theatre is located. */
    city: URLParamStringSchema,

    /** State or region of the theatre. */
    state: URLParamStringSchema,

    /** Country code (ISO 3166-1 alpha-2). */
    country: ISO3166Alpha2CodeEnumSchema.optional(),

    /** Postal or ZIP code. */
    postalCode: URLParamStringSchema,

    /** IANA timezone name (e.g., "Asia/Bangkok"). */
    timezone: IANATimezoneSchema.optional(),
});

/**
 * Schema for sorting theatre results by specified fields and order.
 *
 * Used to validate query parameters that indicate how the theatre list should be sorted.
 * All fields are optional; when present, they must be either `"asc"` or `"desc"`.
 *
 * Example use case:
 * - `/api/theatres?sort[seatCapacity]=desc&sort[city]=asc`
 */
export const TheatreSortSchema = z.object({
    /** Sort by theatre name. */
    sortByName: MongooseSortOrderSchema.optional(),

    /** Sort by seat capacity. */
    sortBySeatCapacity: MongooseSortOrderSchema.optional(),

    /** Sort by city name. */
    sortByCity: MongooseSortOrderSchema.optional(),

    /** Sort by country code. */
    sortByCountry: MongooseSortOrderSchema.optional(),

    /** Sort by postal code. */
    sortByPostalCode: MongooseSortOrderSchema.optional(),

    /** Sort by IANA timezone. */
    sortByTimezone: MongooseSortOrderSchema.optional(),
});

/**
 * Schema representing all query options for filtering and sorting theatres.
 *
 * Combines both {@link TheatreMatchFilterSchema} and {@link TheatreSortSchema},
 * allowing a single schema to validate URL query parameters that may include:
 * - Filtering criteria (e.g., `city=Bangkok`, `seatCapacity=200`)
 * - Sorting preferences (e.g., `sort[seatCapacity]=desc`)
 *
 * Example full query:
 * `/api/theatres?city=Bangkok&seatCapacity=200&sort[seatCapacity]=desc`
 *
 * Use this schema to validate query parameters in theatre search endpoints.
 */
export const TheatreQueryOptionsSchema = TheatreMatchFilterSchema.merge(TheatreSortSchema);