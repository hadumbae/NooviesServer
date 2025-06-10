import Seat from "../model/Seat.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import SeatController from "../controller/SeatController.js";

import SeatQueryService from "../service/SeatQueryService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/AggregateQueryService.js";

export default class SeatServiceProvider {
    static register() {
        const model = Seat;
        const populateRefs = ["theatre", "screen"];

        const queryUtils = QueryUtils;
        const repository = new BaseRepository({model, populateRefs});

        const queryService = new SeatQueryService();
        const aggregateService = new AggregateQueryService({_model: model});

        const controller = new SeatController({repository, queryUtils, queryService, aggregateService});

        return {
            repository,
            queryService,
            controller,
        };
    }
}