import type {FilterQuery, SortOrder} from "mongoose";
import type IMovie from "../../model/Movie.interface.js";
import type {MovieQueryFilters} from "../../schema/query/MovieFilters.types.js";

export interface fetchPaginatedMoviesByQueryParams {
    page: number;
    perPage: number;
    query: FilterQuery<MovieQueryFilters>;
    sort: Record<string, SortOrder>;
}

export default interface IMovieService {
    fetchPaginatedMoviesByQueryWithData(params: fetchPaginatedMoviesByQueryParams): Promise<{
        items: IMovie[],
        totalItems: number
    }>;
}