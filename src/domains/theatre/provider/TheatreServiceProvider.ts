import Theatre from "../model/Theatre.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import TheatreController from "../controller/TheatreController.js";

export default class TheatreServiceProvider {
    static register() {
        const model = Theatre;
        const populateRefs = ['screens', 'seats'];

        const repository = new BaseRepository({model, populateRefs});
        const paginationUtils = PaginationUtils;

        const controller = new TheatreController({repository, paginationUtils});

        return {
            repository,
            controller,
        };
    }
}