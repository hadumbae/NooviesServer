import type ISeat from "../../model/Seat.interface.js";
import type {SeatsByRowSubmitData} from "../../schema/seats/Seat.types.js";

export interface ISeatQueryService {
    createByRow(data: SeatsByRowSubmitData): Promise<ISeat[]>;
}