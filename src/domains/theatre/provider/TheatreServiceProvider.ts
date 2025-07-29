import Theatre from "../model/Theatre.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import TheatreController from "../controller/TheatreController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import type {PopulatePath} from "../../../shared/types/PopulatePath.js";
import TheatreQueryOptionService from "../services/query/option-service/TheatreQueryOptionService.js";

export default class TheatreServiceProvider {
    static register() {
        const model = Theatre;
        const populateRefs: PopulatePath[] = [];

        const repository = new BaseRepository({model, populateRefs});
        const queryUtils = QueryUtils;

        const aggregateService = new AggregateQueryService({model, populateRefs});
        const optionService = new TheatreQueryOptionService();

        const controller = new TheatreController({repository, queryUtils, aggregateService, optionService});

        return {
            repository,
            controller,
        };
    }
}