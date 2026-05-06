/**
 * @fileoverview Zod schema for transforming seat query sort parameters into a Mongoose sort stage.
 */

import {z} from "zod";
import {SeatQueryMatchSortsSchema} from "@domains/seat/_feat/validate-query/SeatQueryMatchSortsSchema";
import {normaliseQuerySortValues} from "@shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms seat query sort values into a Mongoose sort pipeline stage. */
export const SeatQuerySortStageSchema = SeatQueryMatchSortsSchema.transform(normaliseQuerySortValues);

/** Inferred type representing the validated and transformed Mongoose sort stage for seats. */
export type SeatQuerySortStage = z.infer<typeof SeatQuerySortStageSchema>;