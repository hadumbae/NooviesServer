import {TheatreMatchFilterSchema, TheatreQueryOptionsSchema, TheatreSortSchema} from "./TheatreQueryOptions.schema.js";
import {z} from "zod";

/**
 * Type representing the filters used to match theatres.
 *
 * Derived from {@link TheatreMatchFilterSchema}, this type includes optional
 * fields for filtering theatres by name, location, seat capacity, and timezone.
 */
export type TheatreMatchFilters = z.infer<typeof TheatreMatchFilterSchema>;

/**
 * Type representing the sorting options for theatres.
 *
 * Derived from {@link TheatreSortSchema}, this type allows specifying sort order
 * (e.g., "asc" or "desc") on fields such as name, seat capacity, city, and timezone.
 */
export type TheatreSorts = z.infer<typeof TheatreSortSchema>;

/**
 * Type representing the combined query options for theatres, including both filters and sorting.
 *
 * Derived from {@link TheatreQueryOptionsSchema}, this type is a merge of
 * {@link TheatreMatchFilters} and {@link TheatreSorts}.
 */
export type TheatreQueryOptions = z.infer<typeof TheatreQueryOptionsSchema>;