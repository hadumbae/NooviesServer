import type {SortOrder} from "mongoose";

/**
 * Converts a Mongoose-style sort object into a MongoDB aggregation-compatible `$sort` object.
 *
 * Mongoose `SortOrder` can be:
 * - Numbers: `1` (ascending), `-1` (descending)
 * - Strings: `"asc" | "ascending" | "desc" | "descending"`
 *
 * This utility converts string sort orders into numbers and passes numeric values through as-is.
 *
 * @param sorts - An object mapping field names to Mongoose `SortOrder`.
 * @returns A new object mapping field names to `1` (ascending) or `-1` (descending), suitable for `$sort` in aggregation pipelines.
 *
 * @example
 * ```ts
 * const sorts = { releaseDate: "desc", title: "asc", rating: 1 };
 * const aggSort = convertToAggregationSort(sorts);
 * // aggSort === { releaseDate: -1, title: 1, rating: 1 }
 * ```
 */
export default (sorts: Record<string, SortOrder>): Record<string, 1 | -1> =>
    Object.fromEntries(
        Object.entries(sorts).map(([key, value]) => {
                if (value === "asc" || value === "ascending") return [key, 1];
                if (value === "desc" || value === "descending") return [key, -1];
                return [key, value];
            }
        )
    );