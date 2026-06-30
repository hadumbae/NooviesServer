import {MovieInputBaseSchema, type MovieInputData, MovieInputSchema} from "./MovieInputSchema";
import {type MovieTitle, MovieTitleSchema} from "./MovieTitleSchema";
import {type MovieTagline, MovieTaglineSchema} from "./MovieTaglineSchema";
import {type MovieRuntime, MovieRuntimeSchema} from "./MovieRuntimeSchema";
import {type MovieSynopsis, MovieSynopsisSchema} from "./MovieSynopsisSchema";
import {type MovieGenreIDs, MovieGenreIDsSchema} from "./MovieGenreIDsSchema";
import {type MovieLanguages, MovieLanguagesSchema} from "./MovieLanguagesSchema";
import {
    type MovieSnapshotInputData,
    MovieSnapshotInputSchema
} from "@/domains/movie/_feat/validate-submit/MovieSnapshotInputSchema";

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

