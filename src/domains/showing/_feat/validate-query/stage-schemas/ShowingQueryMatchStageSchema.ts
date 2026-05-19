/**
 * @fileoverview Defines the Zod schema for the match stage of a showing query pipeline.
 */

import {z} from "zod";
import {
    ShowingQueryMatchFilterSchema
} from "@domains/showing/_feat/validate-query/match-schemas/ShowingQueryMatchFilterSchema";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that validates and normalizes showing query match filters. */
export const ShowingQueryMatchStageSchema = ShowingQueryMatchFilterSchema.transform(normaliseQueryMatchValues);

/** Type definition for the validated showing query match stage. */
export type ShowingQueryMatchStage = z.infer<typeof ShowingQueryMatchStageSchema>;