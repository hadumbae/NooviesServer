/**
 * @fileoverview Zod schema for transforming person query sort parameters into a Mongoose sort stage.
 */

import {z} from "zod";
import {normaliseQuerySortValues} from "@shared/_feat/pipeline-schema-transformers";
import {PersonQueryMatchSortsSchema} from "@domains/person/_feat/validate-query/PersonQueryMatchSortsSchema";

/** Zod schema that transforms person query sort values into a Mongoose sort pipeline stage. */
export const PersonQuerySortStageSchema = PersonQueryMatchSortsSchema.transform(normaliseQuerySortValues);

/** Inferred type representing the validated and transformed Mongoose sort stage for persons. */
export type PersonQuerySortStage = z.infer<typeof PersonQuerySortStageSchema>;