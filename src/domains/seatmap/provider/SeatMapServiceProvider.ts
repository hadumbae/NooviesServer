import SeatMap from "../model/SeatMap.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import SeatMapController from "../controller/SeatMapController.js";
import SeatMapService from "../service/SeatMapService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import SeatMapQueryService from "../service/SeatMapQueryService.js";
import AggregateQueryService from "../../../shared/services/AggregateQueryService.js";

export default class SeatMapServiceProvider {
    static register() {
        const model = SeatMap;
        const populateRefs = ["seat", "showing"];

        const queryUtils = QueryUtils;
        const repository = new BaseRepository({model, populateRefs});

        const service = new SeatMapService();
        const queryService = new SeatMapQueryService();
        const aggregateService = new AggregateQueryService({_model: model});

        const controller = new SeatMapController({repository, service, queryService, queryUtils, aggregateService});

        return {
            repository,
            controller,
            service,
        }
    }
}