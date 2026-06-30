/**
 * @fileoverview Defines the Zod schema for the reservation query sort stage in the aggregation pipeline.
 */

import {z} from "zod";
import {ReservationQueryMatchSortSchema} from "@/domains/reservations/_feat/validate-query-options/schemas";
import {normaliseQuerySortValues} from "@/shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms raw reservation sort parameters into a Mongoose-compatible sort stage. */
export const ReservationQuerySortStageSchema = ReservationQueryMatchSortSchema.transform(normaliseQuerySortValues);

/** Type definition for the validated reservation query sort stage. */
export type ReservationQuerySortStage = z.infer<typeof ReservationQuerySortStageSchema>;