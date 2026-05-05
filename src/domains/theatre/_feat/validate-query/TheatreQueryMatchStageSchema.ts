/**
 * @fileoverview Zod schema for transforming theatre query match parameters into a Mongoose match stage.
 */

import {z} from "zod";
import {TheatreQueryMatchFilterSchema} from "@domains/theatre/_feat/validate-query/TheatreQueryMatchFilterSchema";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms theatre query match values into a Mongoose match pipeline stage. */
export const TheatreQueryMatchStageSchema = TheatreQueryMatchFilterSchema.transform(normaliseQueryMatchValues);

/** Inferred type representing the validated and transformed Mongoose match stage for theatres. */
export type TheatreQueryMatchStage = z.infer<typeof TheatreQueryMatchStageSchema>;