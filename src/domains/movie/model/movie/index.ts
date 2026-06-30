import {MovieSchema} from "@/domains/movie/model/movie/Movie.schema";
import type {MovieSchemaFields, MovieWithGenres, MovieWithRating} from "@/domains/movie/model/movie/Movie.types";
import {Movie} from "@/domains/movie/model/movie/Movie.model";

export {
    MovieSchema,
    Movie,
}

export type {
    MovieSchemaFields,
    MovieWithGenres,
    MovieWithRating,

}