import {
    TheatreQueryMatchFilterSchema,
    TheatreQueryOptionSchema,
    TheatreQueryMatchSortSchema
} from "./TheatreQueryOption.schema.js";
import { z } from "zod";

/**
 * Type representing the filters that can be applied when querying Theatre documents.
 * Inferred from {@link TheatreQueryMatchFilterSchema}.
 */
export type TheatreQueryMatchFilters = z.infer<typeof TheatreQueryMatchFilterSchema>;

/**
 * Type representing the sorting options available when querying Theatre documents.
 * Inferred from {@link TheatreQueryMatchSortSchema}.
 */
export type TheatreQueryMatchSorts = z.infer<typeof TheatreQueryMatchSortSchema>;

/**
 * Type representing the full set of query options for Theatre documents,
 * including both filters and sorting instructions.
 * Inferred from {@link TheatreQueryOptionSchema}.
 */
export type TheatreQueryOptions = z.infer<typeof TheatreQueryOptionSchema>;
