import {type Document, Types} from "mongoose";
import type IMovie from "../../model/Movie.interface.js";
import type {DeletePosterImageParams, UploadPosterImageParams} from "../../type/services/MovieImageServiceTypes.js";

export interface IMovieImageService {
    fetchMovie(_id: Types.ObjectId): Promise<IMovie & Document>;
    updateMoviePosterImage(params: UploadPosterImageParams): Promise<any>;
    deleteMoviePosterImage(params: DeletePosterImageParams): Promise<any>;
}