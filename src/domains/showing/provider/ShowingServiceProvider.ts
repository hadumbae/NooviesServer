import Showing from "../model/Showing.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import ShowingController from "../controller/ShowingController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";

export default class ShowingServiceProvider {
    static register() {
        const model = Showing;
        const populateRefs= [
            {path: "movie"},
            {path: "theatre"},
            {path: "screen"},
            {path: "seating", populate: {path: "seat"}},
        ];

        const repository = new BaseRepository({model, populateRefs});
        const queryUtils = QueryUtils;

        const controller = new ShowingController({repository, queryUtils: queryUtils});

        return {
            repository,
            controller,
        };
    }
}