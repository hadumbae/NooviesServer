import BaseRepository from "../../../shared/repository/BaseRepository.js";
import GenreModel from "../model/Genre.model.js";
import GenreController from "../controller/GenreController.js";
import type IGenre from "../model/Genre.interface.js";
import GenreService from "../service/GenreService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import GenreQueryOptionService from "../service/GenreQueryOptionService.js";

export default class GenreServiceProvider {
    static register() {
        const model = GenreModel;
        const populateRefs: string[] = [];

        const queryUtils = QueryUtils;
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const repository = new BaseRepository<IGenre>({model, populateRefs});
        const genreService = new GenreService();
        const optionService = new GenreQueryOptionService();

        const controller = new GenreController({
            repository,
            genreService,
            queryUtils,
            aggregateService,
            optionService,
        });

        return {
            repository,
            genreService,
            controller
        };
    }
}