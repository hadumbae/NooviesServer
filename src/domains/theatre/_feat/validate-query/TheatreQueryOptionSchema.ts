/**
 * @fileoverview Unified validation schema for all Theatre-related query operations.
 * Consolidates filtering criteria and sorting instructions into a single schema.
 */

import {z} from "zod";
import {TheatreQueryMatchFilterSchema} from "@domains/theatre/_feat/validate-query/TheatreQueryMatchFilterSchema";
import {TheatreQueryMatchSortSchema} from "@domains/theatre/_feat/validate-query/TheatreQueryMatchSortSchema";

/**
 * Composite Zod schema for Theatre query options.
 */
export const TheatreQueryOptionSchema = TheatreQueryMatchFilterSchema.merge(TheatreQueryMatchSortSchema);

/**
 * TypeScript type inferred from TheatreQueryOptionSchema.
 */
export type TheatreQueryOptions = z.infer<typeof TheatreQueryOptionSchema>;