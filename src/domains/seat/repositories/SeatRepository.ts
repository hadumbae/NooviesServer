import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type ISeat from "../model/Seat.interface.js";
import createSeatDuplicateError from "../utility/createSeatDuplicateError.js";

export default class SeatRepository extends BaseRepository<ISeat> {
    protected throwDuplicateError(indexString: string) {
        throw createSeatDuplicateError(indexString);
    }
}