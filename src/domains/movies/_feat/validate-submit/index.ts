import {
    MovieInputBaseSchema,
    type MovieInputData,
    MovieInputSchema
} from "@/domains/movies/_feat/validate-submit/MovieInputSchema";
import {type MovieTitle, MovieTitleSchema} from "@/domains/movies/_feat/validate-submit/MovieTitleSchema";
import {type MovieTagline, MovieTaglineSchema} from "@/domains/movies/_feat/validate-submit/MovieTaglineSchema";
import {type MovieRuntime, MovieRuntimeSchema} from "@/domains/movies/_feat/validate-submit/MovieRuntimeSchema";
import {type MovieSynopsis, MovieSynopsisSchema} from "@/domains/movies/_feat/validate-submit/MovieSynopsisSchema";
import {type MovieGenreIDs, MovieGenreIDsSchema} from "@/domains/movies/_feat/validate-submit/MovieGenreIDsSchema";
import {type MovieLanguages, MovieLanguagesSchema} from "@/domains/movies/_feat/validate-submit/MovieLanguagesSchema";
import {
    type MovieSnapshotInputData,
    MovieSnapshotInputSchema
} from "@/domains/movies/_feat/validate-submit/MovieSnapshotInputSchema";

export {
    MovieInputBaseSchema,
    MovieSnapshotInputSchema,
    MovieInputSchema,
    MovieTitleSchema,
    MovieTaglineSchema,
    MovieRuntimeSchema,
    MovieSynopsisSchema,
    MovieGenreIDsSchema,
    MovieLanguagesSchema,
}

export type {
    MovieInputData,
    MovieSnapshotInputData,
    MovieTitle,
    MovieTagline,
    MovieRuntime,
    MovieSynopsis,
    MovieGenreIDs,
    MovieLanguages,
}

