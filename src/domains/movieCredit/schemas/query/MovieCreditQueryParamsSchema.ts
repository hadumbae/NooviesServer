import {z} from "zod";
import {MovieCreditMatchQueryParamsSchema} from "./MovieCreditMatchQueryParamsSchema.js";
import {MovieCreditPopulateQueryParamsSchema} from "./MovieCreditPopulateQueryParamsSchema.js";

export const MovieCreditQueryParamsSchema = MovieCreditMatchQueryParamsSchema.merge(MovieCreditPopulateQueryParamsSchema);

export type MovieCreditQueryParams = z.infer<typeof MovieCreditQueryParamsSchema>;