import { z } from "zod";
import {
    PersonQueryMatchFiltersSchema,
    PersonQueryOptionsSchema,
    PersonQueryMatchSortsSchema
} from "./PersonQueryOption.schema.js";

/**
 * Type representing filters that can be applied when querying Person documents.
 * Inferred from {@link PersonQueryMatchFiltersSchema}.
 */
export type PersonQueryMatchFilters = z.infer<typeof PersonQueryMatchFiltersSchema>;

/**
 * Type representing sorting options when querying Person documents.
 * Inferred from {@link PersonQueryMatchSortsSchema}.
 */
export type PersonQueryMatchSorts = z.infer<typeof PersonQueryMatchSortsSchema>;

/**
 * Type representing the complete set of query options for Person documents,
 * including both filters and sorting options.
 * Inferred from {@link PersonQueryOptionsSchema}.
 */
export type PersonQueryOptions = z.infer<typeof PersonQueryOptionsSchema>;
