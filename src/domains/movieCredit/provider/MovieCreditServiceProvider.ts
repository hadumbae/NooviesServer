import MovieCredit from "../models/MovieCredit.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import MovieCreditController from "../controllers/MovieCreditController.js";

export default class MovieCreditServiceProvider {
    static register() {
        const model = MovieCredit;
        const populateRefs = ["person", "movie"];

        const queryUtils = QueryUtils;
        const repository = new BaseRepository({model, populateRefs});

        const crudController = new MovieCreditController({repository, queryUtils});

        return {
            repository,
            crudController,
        }
    }
}