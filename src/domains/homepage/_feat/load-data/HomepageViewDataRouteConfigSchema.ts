/**
 * @fileoverview Zod schema and type definitions for configuring homepage view data query parameters.
 */

import {z} from "zod";
import {preprocessOptionalField} from "@/shared/_feat";
import {PositiveIntegerSchema} from "@/shared/_schema";
import {ISO3166Alpha2CountryCodeSchema} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";

/** Schema for validating and preprocessing input parameters for fetching homepage view data. */
export const HomepageViewDataRouteConfigSchema = z.object({
    country: preprocessOptionalField(ISO3166Alpha2CountryCodeSchema).default("US").catch("US"),
    recentCount: preprocessOptionalField(PositiveIntegerSchema.max(10)).default(10).catch(10),
    genreCount: preprocessOptionalField(PositiveIntegerSchema.max(5)).default(5).catch(5),
    movieCount: preprocessOptionalField(PositiveIntegerSchema.max(10)).default(5).catch(5),
    theatreCount: preprocessOptionalField(PositiveIntegerSchema.max(10)).default(10).catch(10),
    upcomingCount: preprocessOptionalField(PositiveIntegerSchema.max(10)).default(10).catch(10),
    reservationCount: preprocessOptionalField(PositiveIntegerSchema.max(10)).default(10).catch(10),
});

/** Inferred type for validated homepage view data route configuration. */
export type HomepageViewDataRouteConfig = z.infer<typeof HomepageViewDataRouteConfigSchema>;