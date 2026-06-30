/**
 * @fileoverview Defines the schema for the MongoDB match stage in reservation queries.
 */

import {z} from "zod";
import {ReservationQueryMatchFilterSchema} from "src/domains/reservations/_feat/validate-query-options/schemas";
import {normaliseQueryMatchValues} from "@/shared/_feat/pipeline-schema-transformers";

/** Zod schema that transforms raw reservation filters into a valid MongoDB match stage. */
export const ReservationQueryMatchStageSchema = ReservationQueryMatchFilterSchema.transform(normaliseQueryMatchValues);

/** Type definition for the validated reservation query match stage. */
export type ReservationQueryMatchStage = z.infer<typeof ReservationQueryMatchStageSchema>;