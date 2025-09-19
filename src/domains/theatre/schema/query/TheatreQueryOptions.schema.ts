import { z } from "zod";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { MongooseSortOrderSchema } from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";
import { IANATimezoneSchema } from "../../../../shared/schema/timezones/IANATimezone.enum.js";
import { ISO3166Alpha2CodeEnumSchema } from "../../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";

/**
 * Schema for filtering theatres by optional query parameters.
 *
 * All fields are optional and typically correspond to URL query parameters.
 * This schema is used to construct Mongoose filter queries when searching for theatres.
 *
 * Example query:
 * `/api/theatres?city=Bangkok&seatCapacity=200`
 */
export const TheatreQueryFilterSchema = z.object({
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

    /** Country code (ISO 3166-1 alpha-2). Optional. */
    country: ISO3166Alpha2CodeEnumSchema.optional(),

    /** Postal or ZIP code of the theatre. */
    postalCode: URLParamStringSchema,

    /** IANA timezone name (e.g., "Asia/Bangkok"). Optional. */
    timezone: IANATimezoneSchema.optional(),
});

/**
 * Schema for validating theatre sorting options.
 *
 * Used to validate URL query parameters that indicate the sort order of the theatre list.
 * All fields are optional; when present, values must be `"asc"` or `"desc"`.
 *
 * Example query:
 * `/api/theatres?sort[seatCapacity]=desc&sort[city]=asc`
 */
export const TheatreQuerySortSchema = z.object({
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
 * Combines {@link TheatreQueryFilterSchema} and {@link TheatreQuerySortSchema}.
 * This schema validates full URL query parameters for theatre search endpoints,
 * including both filtering criteria and sorting preferences.
 *
 * Example full query:
 * `/api/theatres?city=Bangkok&seatCapacity=200&sort[seatCapacity]=desc`
 */
export const TheatreQueryOptionsSchema = TheatreQueryFilterSchema.merge(TheatreQuerySortSchema);
