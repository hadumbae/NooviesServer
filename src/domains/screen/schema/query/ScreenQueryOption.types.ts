import { z } from "zod";
import {
    ScreenQueryMatchFilterSchema,
    ScreenQueryOptionsSchema,
    ScreenQueryParamSchema,
    ScreenQueryMatchSortSchema
} from "./ScreenQueryOption.schema.js";

/**
 * Filters that can be applied to Screen documents.
 *
 * Corresponds to {@link ScreenQueryMatchFilterSchema}.
 *
 * @example
 * // Filter by theatre ID and minimum capacity
 * const filters: ScreenQueryMatchFilters = {
 *   theatre: "123",
 *   capacity: 100
 * };
 */
export type ScreenQueryMatchFilters = z.infer<typeof ScreenQueryMatchFilterSchema>;

/**
 * Sorting options for Screen queries.
 *
 * Corresponds to {@link ScreenQueryMatchSortSchema}.
 *
 * @example
 * // Sort by capacity ascending and name descending
 * const sorts: ScreenQueryMatchSorts = {
 *   sortByCapacity: 1,
 *   sortByName: -1
 * };
 */
export type ScreenQueryMatchSorts = z.infer<typeof ScreenQueryMatchSortSchema>;

/**
 * Additional parameters for Screen queries.
 *
 * Corresponds to {@link ScreenQueryParamSchema}.
 *
 * @example
 * // Limit the number of showings per screen
 * const params: ScreenQueryParams = {
 *   showingsPerScreen: 5
 * };
 */
export type ScreenQueryParams = z.infer<typeof ScreenQueryParamSchema>;

/**
 * Complete set of query options for Screen queries, combining:
 * - Filters (`ScreenQueryMatchFilters`)
 * - Sorting (`ScreenQueryMatchSorts`)
 * - Additional parameters (`ScreenQueryParams`)
 *
 * Corresponds to {@link ScreenQueryOptionsSchema}.
 *
 * @example
 * const options: ScreenQueryOptions = {
 *   name: "IMAX",
 *   sortByCapacity: -1,
 *   showingsPerScreen: 3
 * };
 */
export type ScreenQueryOptions = z.infer<typeof ScreenQueryOptionsSchema>;
