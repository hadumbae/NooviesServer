import Movie from "../model/Movie.js";
import type IMovie from "../model/IMovie.js";

import MovieController from "../controller/MovieController.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import MovieImageService from "../service/MovieImageService.js";

import CloudinaryUtils from "../../../shared/utility/CloudinaryUtils.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import MovieService from "../service/MovieService.js";
import MovieURLService from "../service/MovieURLService.js";
import MovieFavouriteService from "../service/user/MovieFavouriteService.js";
import MovieFavouriteController from "../controller/MovieFavouriteController.js";
import type {PopulatePath} from "../../../shared/types/PopulatePath.js";

export default class MovieServiceProvider {
    static register() {
        const model = Movie;
        const populateRefs: PopulatePath[] = [
            {path: "genres"},
            {path: "showings"},
            {path: "crew", populate: {path: "person"}},
            {path: "cast", populate: {path: "person"}},
        ];

        const queryUtils = QueryUtils;
        const cloudinaryUtils = CloudinaryUtils;

        const repository = new BaseRepository<IMovie>({model, populateRefs});

        const service = new MovieService();
        const urlService = new MovieURLService();
        const favouriteService = new MovieFavouriteService();
        const imageService = new MovieImageService({repository, cloudinaryUtils});

        const crudController = new MovieController({
            repository,
            queryUtils,
            service,
            urlService,
            imageService,
        });

        const favouriteController = new MovieFavouriteController({
            queryUtils,
            urlService,
            favouriteService,
        });

        return {
            repository,

            imageService,
            urlService,
            favouriteService,

            crudController,
            favouriteController,
        }
    }
}