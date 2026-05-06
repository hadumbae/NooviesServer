/**
 * @fileoverview Zod schema for transforming seat query match parameters into a Mongoose match stage.
 */

import {z} from "zod";
import {SeatQueryMatchFiltersSchema} from "@domains/seat/_feat/validate-query/SeatQueryMatchFilterSchema";
import {normaliseQueryMatchValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms seat query match values into a Mongoose match pipeline stage. */
export const SeatQueryMatchStageSchema = SeatQueryMatchFiltersSchema.transform(normaliseQueryMatchValues);

/** Inferred type representing the validated and transformed Mongoose match stage for seats. */
export type SeatQueryMatchStage = z.infer<typeof SeatQueryMatchStageSchema>;