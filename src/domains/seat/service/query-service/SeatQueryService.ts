import type {ISeatQueryService} from "./SeatQueryService.types.js";
import Seat from "../../model/Seat.js";
import type ISeat from "../../model/ISeat.js";
import type {SeatsByRowSubmitData} from "../../schema/seats/Seat.types.js";

export default class SeatQueryService implements ISeatQueryService {
    async createByRow(data: SeatsByRowSubmitData): Promise<ISeat[]> {
        const {row, numberOfSeats, ...baseParams} = data;

        const queries = [];

        for (let i = 1; i <= numberOfSeats; i++) {
            const createData = {row, x: i, seatNumber: i, seatLabel: `${row}${i}`, ...baseParams};
            queries.push(createData);
        }

        return (await Seat.insertMany(queries)).map(doc => doc.toObject());
    }
}