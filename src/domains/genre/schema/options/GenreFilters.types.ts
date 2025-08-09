import {z} from "zod";
import {type GenreQueryFiltersSchema, GenreQueryOptionsSchema, GenreQuerySortsSchema} from "./GenreFilters.schema.js";

/**
 * Type representing filter parameters for querying genres.
 *
 * @remarks
 * This is the inferred TypeScript type from {@link GenreQueryFiltersSchema}.
 * It typically includes properties like `name` for filtering genres by name.
 *
 * @example
 * ```ts
 * const filters: GenreQueryFilters = { name: "Rock" };
 * ```
 */
export type GenreQueryFilters = z.infer<typeof GenreQueryFiltersSchema>;

/**
 * Type representing sort parameters for querying genres.
 *
 * @remarks
 * This is the inferred TypeScript type from {@link GenreQuerySortsSchema}.
 * It is usually used to specify sort orders, such as ascending or descending by `name`.
 *
 * @example
 * ```ts
 * const sorts: GenreQuerySorts = { sortByName: 1 };
 * ```
 */
export type GenreQuerySorts = z.infer<typeof GenreQuerySortsSchema>;

/**
 * Type representing combined filter and sort parameters for querying genres.
 *
 * @remarks
 * This type is inferred from {@link GenreQueryOptionsSchema}, which merges
 * both filter and sort schemas into one type. It allows specifying filters
 * and sorting options in the same object.
 *
 * @example
 * ```ts
 * const options: GenreQueryOptions = {
 *   name: "Jazz",
 *   sortByName: -1
 * };
 * ```
 */
export type GenreQueryOptions = z.infer<typeof GenreQueryOptionsSchema>;