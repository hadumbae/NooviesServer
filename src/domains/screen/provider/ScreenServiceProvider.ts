import Screen from "../model/Screen.js";

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import ScreenController from "../controller/ScreenController.js";

import ScreenQueryService from "../service/ScreenQueryService.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import ScreenService from "../service/ScreenService.js";

export default class ScreenServiceProvider {
    static register() {
       const model = Screen;
       const populateRefs = ["theatre", "seats", "showings"];

       const repository = new BaseRepository({model, populateRefs});
       const queryUtils = QueryUtils;

       const service = new ScreenService();
       const queryService = new ScreenQueryService();

       const controller = new ScreenController({repository, queryUtils, service, queryService});

       return {
         repository,
         controller,
       };
    }
}