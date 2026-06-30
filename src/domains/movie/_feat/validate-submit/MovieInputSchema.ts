/**
 * @fileoverview Zod schemas for validating movie submission and update inputs.
 *
 */

import {z} from "zod";
import {URLStringSchema} from "@/shared/schema/strings/URLStringSchema";
import {CoercedBooleanValueSchema} from "@/shared/schema/booleans/CoercedBooleanValueSchema";
import {ISO6391LanguageCodeSchema} from "@/shared/schema/enums/ISO6391LanguageCodeSchema";
import {ISO3166Alpha2CountryCodeSchema} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import {UTCDateOnlySchema} from "@/shared/schema/date-time/UTCDateOnlySchema";
import {MovieTitleSchema} from "@/domains/movie/_feat/validate-submit/MovieTitleSchema";
import {MovieTaglineSchema} from "@/domains/movie/_feat/validate-submit/MovieTaglineSchema";
import {MovieSynopsisSchema} from "@/domains/movie/_feat/validate-submit/MovieSynopsisSchema";
import {MovieGenreIDsSchema} from "@/domains/movie/_feat/validate-submit/MovieGenreIDsSchema";
import {MovieRuntimeSchema} from "@/domains/movie/_feat/validate-submit/MovieRuntimeSchema";
import {MovieLanguagesSchema} from "@/domains/movie/_feat/validate-submit/MovieLanguagesSchema";

/** Base schema defining the core fields required for a movie input object. */
export const MovieInputBaseSchema = z.object({
    title: MovieTitleSchema,
    originalTitle: MovieTitleSchema.optional(),
    tagline: MovieTaglineSchema,
    synopsis: MovieSynopsisSchema,
    genres: MovieGenreIDsSchema,
    releaseDate: UTCDateOnlySchema.optional().nullable(),
    isReleased: CoercedBooleanValueSchema.optional(),
    runtime: MovieRuntimeSchema,
    originalLanguage: ISO6391LanguageCodeSchema,
    country: ISO3166Alpha2CountryCodeSchema,
    languages: MovieLanguagesSchema,
    subtitles: MovieLanguagesSchema,
    trailerURL: URLStringSchema.optional().nullable(),
    isAvailable: CoercedBooleanValueSchema.optional(),
});

/** Refined schema that enforces conditional validation logic between release status and date. */
export const MovieInputSchema = MovieInputBaseSchema.superRefine(
    ({isReleased, releaseDate}, ctx) => {
        if (isReleased && !releaseDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A release date is required if the movie is released.",
                path: ["releaseDate"],
            });

            return z.NEVER;
        }
    },
);

/** Data structure for movie input validation. */
export type MovieInputData = z.infer<typeof MovieInputSchema>;
