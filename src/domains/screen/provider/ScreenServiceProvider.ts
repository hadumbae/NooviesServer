import Screen from "../model/Screen.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import ScreenController from "../controller/ScreenController.js";
import {ScreenQueryService} from "../service/ScreenQueryService.js";

export default class ScreenServiceProvider {
    static register() {
       const model = Screen;
       const populateRefs = ["theatre", "seats"];

       const paginationUtils = PaginationUtils;
       const repository = new BaseRepository({model, populateRefs});
       const queryService = new ScreenQueryService();

       const controller = new ScreenController({
           repository,
           paginationUtils,
           queryService,
       });

       return {
         repository,
         controller,
       };
    }
}