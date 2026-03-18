/**
 * @file Query schema for showings view requests.
 * @filename ShowingsViewQueryStringSchema.ts
 */

import {z} from "zod";
import {URLStringSchema} from "../../../../../shared/schema/strings/URLStringSchema.js";
import {ISO3166Alpha2CountryCodeSchema} from "../../../../../shared/schema/enums/ISO3166Alpha2CountryCodeSchema.js";
import {QueryPaginationParamsSchema} from "../../../../../shared/schema/query/QueryPaginationParamsSchema.js";

/**
 * Query parameters for fetching showings in the movie view.
 *
 * Extends pagination with location-based filtering.
 */
export const ShowingsViewQueryStringSchema =
    QueryPaginationParamsSchema.extend({
        near: URLStringSchema.optional(),
        country: ISO3166Alpha2CountryCodeSchema,
    });

/**
 * Inferred type for showings view query parameters.
 */
export type ShowingsViewQueryStrings =
    z.infer<typeof ShowingsViewQueryStringSchema>;