import type {PopulatePath} from "../mongoose/PopulatePath.js";

/**
 * ⚡ RequestOptions
 *
 * Options that control how repository/query operations
 * retrieve, enrich, and shape documents.
 *
 * These options apply to find, findById, update, and pagination
 * operations across the repository layer.
 */
export type RequestOptions = {
    /**
     * Maximum number of documents to return.
     * Applies primarily to `find` queries and pagination internals.
     */
    limit?: number;

    /**
     * Whether to populate referenced fields using Mongoose `populate()`.
     * Defaults to `false` unless explicitly enabled.
     *
     * When `true`, population behaviour is determined by:
     * - repository defaults, or
     * - the `populatePaths` array if provided
     */
    populate?: boolean;

    /**
     * Whether to include virtual fields defined in the schema.
     * Applies only when using `.lean()` queries.
     *
     * Useful for returning computed metadata (e.g. fullName, derived states).
     */
    virtuals?: boolean;

    /**
     * Explicit populate paths to apply when `populate` is enabled.
     *
     * Overrides repository-level defaults.
     * Useful for specifying:
     * - nested population
     * - custom per-request populate patterns
     */
    populatePaths?: PopulatePath[];
};
