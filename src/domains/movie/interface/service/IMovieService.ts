import type {FilterQuery, SortOrder} from "mongoose";
import type {MovieQueryParams} from "../../schema/query/MovieQueryMatchParamSchema.js";
import type IMovie from "../../model/IMovie.js";

export interface fetchPaginatedMoviesByQueryParams {
    page: number;
    perPage: number;
    query: FilterQuery<MovieQueryParams>;
    sort: Record<string, SortOrder>;
}

export default interface IMovieService {
    fetchPaginatedMoviesByQueryWithData(params: fetchPaginatedMoviesByQueryParams): Promise<{
        items: IMovie[],
        totalItems: number
    }>;
}