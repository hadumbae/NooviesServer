/**
 * @fileoverview Defines the validation schema for movie snapshot input data.
 *
 */

import {z} from "zod";
import {URLStringSchema} from "@/shared/schema/strings/URLStringSchema";
import {MovieTitleSchema} from "@/domains/movies/_feat/validate-submit/MovieTitleSchema";
import {MovieTaglineSchema} from "@/domains/movies/_feat/validate-submit/MovieTaglineSchema";
import {DateInstanceSchema} from "@/shared/schema/date-time/DateInstanceSchema";
import generateArraySchema from "@/shared/utility/schema/generateArraySchema";
import { NonEmptyStringSchema } from "@/shared/schema/strings/NonEmptyStringSchema";
import {MovieRuntimeSchema} from "@/domains/movies/_feat/validate-submit/MovieRuntimeSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";

/** Zod schema for validating movie snapshot input data. */
export const MovieSnapshotInputSchema = z.object({
    title: MovieTitleSchema,
    originalTitle: MovieTitleSchema,
    tagline: MovieTaglineSchema,
    posterURL: URLStringSchema.optional().nullable(),
    releaseDate: DateInstanceSchema.optional().nullable(),
    genres: generateArraySchema(NonEmptyStringSchema.max(150, "Must be 150 characters or less.")),
    runtime: MovieRuntimeSchema,
    country: ISO3166Alpha2CountryCodeSchema,
});

/** Type definition inferred from the MovieSnapshotInputSchema. */
export type MovieSnapshotInputData = z.infer<typeof MovieSnapshotInputSchema>;
