import Theatre from "../model/Theatre.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import TheatreController from "../controller/TheatreController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";

export default class TheatreServiceProvider {
    static register() {
        const model = Theatre;
        const populateRefs = ['screens', 'seats'];

        const repository = new BaseRepository({model, populateRefs});
        const queryUtils = QueryUtils;

        const controller = new TheatreController({repository, queryUtils});

        return {
            repository,
            controller,
        };
    }
}