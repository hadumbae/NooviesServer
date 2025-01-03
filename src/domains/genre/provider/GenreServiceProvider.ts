import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Genre from "../model/Genre.js";
import GenreController from "../controller/GenreController.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import type IGenre from "../model/IGenre.js";

export default class GenreServiceProvider {
    static register() {
        const model = Genre;
        const populateRefs = ['movies'];

        const repository = new BaseRepository<IGenre>({model, populateRefs});
        const paginationUtils = PaginationUtils;

        const controller = new GenreController({repository, paginationUtils});

        return {
            repository,
            controller
        };
    }
}