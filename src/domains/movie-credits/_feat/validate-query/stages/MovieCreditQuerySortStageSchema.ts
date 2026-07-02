/** @fileoverview Defines the schema for validating and normalising movie credit query sort stages. */


import {z} from "zod";
import {MovieCreditQueryMatchSortsSchema} from "@/domains/movie-credits/_feat/validate-query";
import {normaliseQuerySortValues} from "@/shared/_feat/pipeline-schema-transformers";

/** Zod schema that validates and transforms movie credit sort parameters into a normalised format. */
export const MovieCreditQuerySortStageSchema = MovieCreditQueryMatchSortsSchema.transform(normaliseQuerySortValues);

/** Type definition for the validated movie credit query sort stage. */
export type MovieCreditQuerySortStage = z.infer<typeof MovieCreditQuerySortStageSchema>;