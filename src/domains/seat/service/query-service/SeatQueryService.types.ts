import type {ZSeat} from "../../schema/seats/Seat.types.js";
import type {SeatsByRowSubmitData} from "../../schema/submits/SeatSubmit.types.js";

export interface ISeatQueryService {
    createByRow(data: SeatsByRowSubmitData): Promise<ZSeat[]>;
}