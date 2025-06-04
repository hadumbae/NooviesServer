import {z} from "zod";
import {MovieCreditMatchQueryParamsSchema} from "./MovieCreditMatchQueryParamsSchema.js";
import {MovieCreditPopulateQueryParamsSchema} from "./MovieCreditPopulateQueryParamsSchema.js";

/**
 * Combined schema for all query parameters related to filtering and
 * populating movie credit records.
 *
 * This merges:
 * - {@link MovieCreditMatchQueryParamsSchema} — filters specific to credit attributes,
 * - {@link MovieCreditPopulateQueryParamsSchema} — filters on related entities like movie titles or person names.
 *
 * All fields are optional and validated according to their respective schemas.
 */
export const MovieCreditQueryParamsSchema = MovieCreditMatchQueryParamsSchema.merge(MovieCreditPopulateQueryParamsSchema);

/**
 * Type inferred from {@link MovieCreditQueryParamsSchema}.
 *
 * Represents the complete set of query parameters that can be used
 * when querying movie credits, including both direct match filters and
 * population-based filters.
 */
export type MovieCreditQueryParams = z.infer<typeof MovieCreditQueryParamsSchema>;