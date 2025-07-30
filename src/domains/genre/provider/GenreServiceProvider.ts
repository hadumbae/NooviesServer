import BaseRepository from "../../../shared/repository/BaseRepository.js";
import GenreModel from "../model/Genre.model.js";
import GenreController from "../controller/GenreController.js";
import type IGenre from "../model/Genre.interface.js";
import GenreService from "../service/GenreService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

export default class GenreServiceProvider {
    static register() {
        const model = GenreModel;
        const populateRefs = ['movies'];

        const repository = new BaseRepository<IGenre>({model, populateRefs});
        const genreService = new GenreService();
        const queryUtils = QueryUtils;
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new GenreController({repository, genreService, queryUtils, aggregateService});

        return {
            repository,
            genreService,
            controller
        };
    }
}