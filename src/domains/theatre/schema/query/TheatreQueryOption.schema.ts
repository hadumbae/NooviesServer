import { z } from "zod";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { IANATimezoneSchema } from "../../../../shared/schema/date-time/IANATimezoneSchema.js";
import { ISO3166Alpha2CountryCodeSchema } from "../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Filters that can be applied when querying Theatre documents.
 */
export const TheatreQueryMatchFilterSchema = z.object({
    /** Name of the theatre. */
    name: URLParamStringSchema,

    /** Seating capacity (non-negative number). */
    seatCapacity: URLParamNonNegativeNumberSchema,

    /** Street address of the theatre. */
    street: URLParamStringSchema,

    /** City where the theatre is located. */
    city: URLParamStringSchema,

    /** State where the theatre is located. */
    state: URLParamStringSchema,

    /** Country of the theatre (ISO 3166-1 alpha-2 code, optional). */
    country: ISO3166Alpha2CountryCodeSchema.optional(),

    /** Postal code of the theatre. */
    postalCode: URLParamStringSchema,

    /** Timezone of the theatre (IANA format, optional). */
    timezone: IANATimezoneSchema.optional(),
});

/**
 * Sorting options when querying Theatre documents.
 */
export const TheatreQueryMatchSortSchema = z.object({
    /** Sort by theatre name ascending or descending. */
    sortByName: URLParamMongooseSortOrderSchema,

    /** Sort by seating capacity ascending or descending. */
    sortBySeatCapacity: URLParamMongooseSortOrderSchema,

    /** Sort by city ascending or descending. */
    sortByCity: URLParamMongooseSortOrderSchema,

    /** Sort by state ascending or descending. */
    sortByState: URLParamMongooseSortOrderSchema,

    /** Sort by country ascending or descending. */
    sortByCountry: URLParamMongooseSortOrderSchema,

    /** Sort by postal code ascending or descending. */
    sortByPostalCode: URLParamMongooseSortOrderSchema,

    /** Sort by timezone ascending or descending. */
    sortByTimezone: URLParamMongooseSortOrderSchema,
});

/**
 * Combined schema for Theatre query options including both filters and sorting.
 */
export const TheatreQueryOptionSchema = TheatreQueryMatchFilterSchema.merge(TheatreQueryMatchSortSchema);
