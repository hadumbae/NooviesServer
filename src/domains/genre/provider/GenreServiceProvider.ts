import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Genre, {type IGenre} from "../model/GenreModel.js";
import GenreController from "../controller/GenreController.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";

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