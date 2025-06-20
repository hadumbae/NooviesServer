import Theatre from "../model/Theatre.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import TheatreController from "../controller/TheatreController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";

export default class TheatreServiceProvider {
    static register() {
        const model = Theatre;
        const populateRefs = ['screens', 'seats'];

        const repository = new BaseRepository({model, populateRefs});
        const queryUtils = QueryUtils;
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new TheatreController({repository, queryUtils, aggregateService});

        return {
            repository,
            controller,
        };
    }
}