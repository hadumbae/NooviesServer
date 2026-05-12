/**
 * @fileoverview Defines the Zod schema for validating and transforming movie credit query match stages.
 */
import {z} from "zod";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";
import {MovieCreditQueryMatchFiltersSchema} from "@domains/movieCredit/_feat/validate-query";

/** Zod schema that validates movie credit filters and normalizes their match values. */
export const MovieCreditQueryMatchStageSchema = MovieCreditQueryMatchFiltersSchema.transform(normaliseQueryMatchValues);

/** Type definition for the validated movie credit query match stage. */
export type MovieCreditQueryMatchStage = z.infer<typeof MovieCreditQueryMatchStageSchema>;