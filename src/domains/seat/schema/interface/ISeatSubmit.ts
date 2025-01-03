import type {SeatTypeEnumType} from "../enum/SeatTypeEnum.js";

export default interface ISeatSubmit {
    row: string,
    seatNumber: string,
    seatType: SeatTypeEnumType,
    isAvailable: boolean,
    priceMultiplier: number,
    theatre: string;
}