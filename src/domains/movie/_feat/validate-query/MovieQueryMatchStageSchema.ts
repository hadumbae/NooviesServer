/**
 * @fileoverview Defines the Zod schema for the MongoDB match stage in movie queries.
 */

import {z} from "zod";
import {MovieQueryFiltersSchema} from "./MovieQueryFiltersSchema";
import {normaliseQueryMatchValues} from "@/shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms raw movie filters into a valid MongoDB match stage. */
export const MovieQueryMatchStageSchema = MovieQueryFiltersSchema.transform(normaliseQueryMatchValues);

/** Type definition for the validated movie query match stage. */
export type MovieQueryMatchStage = z.infer<typeof MovieQueryMatchStageSchema>;