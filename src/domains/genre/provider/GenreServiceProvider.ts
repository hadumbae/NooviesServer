import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Genre from "../model/Genre.js";
import GenreController from "../controller/GenreController.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import type IGenre from "../model/IGenre.js";
import GenreService from "../service/GenreService.js";

export default class GenreServiceProvider {
    static register() {
        const model = Genre;
        const populateRefs = ['movies'];

        const repository = new BaseRepository<IGenre>({model, populateRefs});
        const genreService = new GenreService();
        const paginationUtils = PaginationUtils;

        const controller = new GenreController({
            repository,
            genreService,
            paginationUtils
        });

        return {
            repository,
            genreService,
            controller
        };
    }
}