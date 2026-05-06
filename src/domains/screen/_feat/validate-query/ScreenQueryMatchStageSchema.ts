/**
 * @fileoverview Zod schema for transforming screen query match parameters into a Mongoose match stage.
 */

import {z} from "zod";
import {ScreenQueryMatchFilterSchema} from "@domains/screen/_feat/validate-query/ScreenQueryMatchFilterSchema";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms screen query match values into a Mongoose match pipeline stage. */
export const ScreenQueryMatchStageSchema = ScreenQueryMatchFilterSchema.transform(normaliseQueryMatchValues);

/** Inferred type representing the validated and transformed Mongoose match stage for screens. */
export type ScreenQueryMatchStage = z.infer<typeof ScreenQueryMatchStageSchema>;