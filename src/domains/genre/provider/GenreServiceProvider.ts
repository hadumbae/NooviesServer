import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Genre from "../model/Genre.js";
import GenreController from "../controller/GenreController.js";
import type IGenre from "../model/IGenre.js";
import GenreService from "../service/GenreService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";

export default class GenreServiceProvider {
    static register() {
        const model = Genre;
        const populateRefs = ['movies'];

        const repository = new BaseRepository<IGenre>({model, populateRefs});
        const genreService = new GenreService();
        const queryUtils = QueryUtils;

        const controller = new GenreController({repository, genreService, queryUtils});

        return {
            repository,
            genreService,
            controller
        };
    }
}