/**
 * @fileoverview Defines the schema for the sorting stage of a showing query.
 */

import {z} from "zod";
import {
    ShowingQueryMatchSortSchema
} from "@domains/showing/_feat/validate-query/match-schemas/ShowingQueryMatchSortSchema";
import {normaliseQuerySortValues} from "@shared/_feat/pipeline-schema-transformers";

/** Schema that transforms raw showing sort parameters into a normalized format. */
export const ShowingQuerySortStageSchema = ShowingQueryMatchSortSchema.transform(normaliseQuerySortValues);

/** Type definition for the validated showing query sort stage. */
export type ShowingQuerySortStage = z.infer<typeof ShowingQuerySortStageSchema>;