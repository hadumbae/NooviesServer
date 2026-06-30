/**
 * @fileoverview Defines options for configuring repository and query operations.
 */

import type {PopulatePath} from "@/shared/types/mongoose/PopulatePath.js";

/** Options that control how repository operations retrieve, enrich, and shape documents. */
export type QueryConfig = {
    select?: string;
    lean?: boolean;
    limit?: number;
    populate?: boolean;
    virtuals?: boolean;
    populatePaths?: PopulatePath[];
};
