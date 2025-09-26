import type {ISeatQueryService} from "./SeatQueryService.types.js";
import type ISeat from "../../model/Seat.interface.js";
import type {SeatsByRowSubmitData} from "../../schema/seats/SeatInput.types.js";
import Seat from "../../model/Seat.model.js";
import createSeatDuplicateError from "../../utility/createSeatDuplicateError.js";

export default class SeatQueryService implements ISeatQueryService {
    async createByRow(data: SeatsByRowSubmitData): Promise<ISeat[]> {
        const {row, numberOfSeats, ...baseParams} = data;

        const queries = [];

        for (let i = 1; i <= numberOfSeats; i++) {
            const createData = {row, x: i, seatNumber: i, seatLabel: `${row}${i}`, ...baseParams};
            queries.push(createData);
        }

        try {
            const docs = await Seat.insertMany(queries);
            return docs.map(doc => doc.toObject());
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
                const indexName = (error as any).errmsg.match(/index: (\S+)/)?.[1];
                throw createSeatDuplicateError(indexName);
            } else {
                throw (error);
            }
        }

    }
}