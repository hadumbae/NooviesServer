import Showing from "../model/Showing.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import ShowingController from "../controller/ShowingController.js";

export default class ShowingServiceProvider {
    static register() {
        const model = Showing;
        const populateRefs = ["movie", "theatre", "screen", "seatMap.seat"];

        const repository = new BaseRepository({model, populateRefs});
        const paginationUtils = PaginationUtils;

        const controller = new ShowingController({repository, paginationUtils});

        return {
            repository,
            controller,
        };
    }
}