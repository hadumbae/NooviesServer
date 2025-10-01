import { z } from "zod";
import {
    type RoleTypeQueryMatchFiltersSchema,
    RoleTypeQueryOptionsSchema,
    RoleTypeQueryMatchSortsSchema
} from "./RoleTypeOption.schema.js";

/**
 * Type representing filters that can be applied when querying RoleType documents.
 * Inferred from {@link RoleTypeQueryMatchFiltersSchema}.
 */
export type RoleTypeQueryMatchFilters = z.infer<typeof RoleTypeQueryMatchFiltersSchema>;

/**
 * Type representing sorting options when querying RoleType documents.
 * Inferred from {@link RoleTypeQueryMatchSortsSchema}.
 */
export type RoleTypeQueryMatchSorts = z.infer<typeof RoleTypeQueryMatchSortsSchema>;

/**
 * Type representing the complete set of query options for RoleType documents,
 * including both filters and sorting options.
 * Inferred from {@link RoleTypeQueryOptionsSchema}.
 */
export type RoleTypeQueryOptions = z.infer<typeof RoleTypeQueryOptionsSchema>;
