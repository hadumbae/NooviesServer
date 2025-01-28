import type {SeatType} from "../enum/SeatTypeEnum.js";

export default interface ISeatSubmit {
    row: string,
    seatNumber: string,
    seatType: SeatType,
    isAvailable: boolean,
    priceMultiplier: number,
    theatre: string;
}