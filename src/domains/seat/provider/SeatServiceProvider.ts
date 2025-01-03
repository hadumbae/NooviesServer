import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Seat from "../model/Seat.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import SeatController from "../controller/SeatController.js";

export default class SeatServiceProvider {
    static register() {
        const model = Seat;
        const populateRefs = ["threatre"];

        const repository = new BaseRepository({model, populateRefs});
        const paginationUtils = PaginationUtils;

        const controller = new SeatController({repository, paginationUtils});

        return {
            repository,
            controller,
        };
    }
}