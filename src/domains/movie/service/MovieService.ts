import type IMovie from "../model/IMovie.js";
import type IMovieService from "../interface/service/IMovieService.js";
import type {fetchPaginatedMoviesByQueryParams} from "../interface/service/IMovieService.js";
import MovieModel from "../model/Movie.js";

export default class MovieService implements IMovieService {
    async fetchPaginatedMoviesByQueryWithData(
        {page, perPage, query, sort}: fetchPaginatedMoviesByQueryParams
    ): Promise<{
        items: IMovie[],
        totalItems: number
    }> {
        const count = await MovieModel.countDocuments(query);
        const movies = await MovieModel
            .find(query)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate({
                path: "showings",
                match: {isActive: true},
                populate: [
                    {path: "theatre"},
                    {path: "screen"},
                    {path: "seating", populate: {path: "seat"}},
                ]
            });

        return {items: movies, totalItems: count};
    }
}