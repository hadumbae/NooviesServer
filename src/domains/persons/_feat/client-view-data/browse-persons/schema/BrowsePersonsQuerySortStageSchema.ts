/**
 * @fileoverview Zod schema for validating and transforming person browsing sort parameters.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@/shared/_feat/parse-query-string";
import {normaliseQuerySortValues} from "@/shared/_feat/pipeline-schema-transformers";

/** Schema for the sort stage of the browse persons query. */
export const BrowsePersonsQuerySortStageSchema = z.object({
    sortByName: URLParamSortOrderSchema,
}).transform(normaliseQuerySortValues);

/** Type definition for the browse persons query sort stage. */
export type BrowsePersonsQuerySortStage = z.infer<typeof BrowsePersonsQuerySortStageSchema>;