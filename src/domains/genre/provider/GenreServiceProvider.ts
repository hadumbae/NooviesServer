import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Genre from "../model/Genre.js";
import GenreController from "../controller/GenreController.js";
import type IGenre from "../model/IGenre.js";
import GenreService from "../service/GenreService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/AggregateQueryService.js";

export default class GenreServiceProvider {
    static register() {
        const model = Genre;
        const populateRefs = ['movies'];

        const repository = new BaseRepository<IGenre>({model, populateRefs});
        const genreService = new GenreService();
        const queryUtils = QueryUtils;
        const aggregateService = new AggregateQueryService({_model: model});

        const controller = new GenreController({repository, genreService, queryUtils, aggregateService});

        return {
            repository,
            genreService,
            controller
        };
    }
}