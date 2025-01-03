import Screen from "../model/Screen.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import ScreenController from "../controller/ScreenController.js";

export default class ScreenServiceProvider {
    static register() {
       const model = Screen;
       const populateRefs = ["theatre", "seats"];

       const repository = new BaseRepository({model, populateRefs});
       const paginationUtils = PaginationUtils;

       const controller = new ScreenController({repository, paginationUtils});

       return {
         repository,
         controller,
       };
    }
}