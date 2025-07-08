import Seat from "../model/Seat.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import SeatController from "../controller/SeatController.js";

import SeatQueryOptionService from "../service/SeatQueryOptionService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import SeatQueryService from "../service/query-service/SeatQueryService.js";

export default class SeatServiceProvider {
    static register() {
        const model = Seat;
        const populateRefs = ["theatre", "screen"];

        const queryUtils = QueryUtils;
        const repository = new BaseRepository({model, populateRefs});

        const queryService = new SeatQueryService();
        const optionService = new SeatQueryOptionService();
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new SeatController({
            repository,
            queryUtils,
            queryService,
            optionService,
            aggregateService,
        });

        return {
            repository,
            optionService,
            controller,
        };
    }
}