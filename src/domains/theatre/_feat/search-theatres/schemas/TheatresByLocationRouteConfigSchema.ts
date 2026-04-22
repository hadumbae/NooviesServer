/**
 * @fileoverview Route parameter validation schema for location-based theatre searches.
 */

import { z } from "zod";
import {
    RequestPaginationOptionsSchema
} from "@shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import { RequestOptionsSchema } from "@shared/_feat/fetch-request-options/schemas";
import { LocationTargetObjectSchema } from "@shared/schema/features/location-query-options/LocationQueryOptions.schema";

/**
 * Validation schema for theatre location queries, merging pagination, result limits, and geographic target fields.
 */
export const TheatresByLocationRouteConfigSchema = RequestPaginationOptionsSchema
    .merge(RequestOptionsSchema.pick({ limit: true }))
    .merge(LocationTargetObjectSchema);

/**
 * Type definition inferred from the theatre location route configuration schema.
 */
export type TheatresByLocationRouteConfig = z.infer<typeof TheatresByLocationRouteConfigSchema>;