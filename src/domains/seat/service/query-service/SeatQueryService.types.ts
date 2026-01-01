import type {SeatsByRowSubmitData} from "../../schema/seats/SeatInput.types.js";
import type {SeatSchemaFields} from "../../model/Seat.types.js";

export interface ISeatQueryService {
    createByRow(data: SeatsByRowSubmitData): Promise<SeatSchemaFields[]>;
}