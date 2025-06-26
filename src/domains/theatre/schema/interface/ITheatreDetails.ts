import type ITheatre from "../../model/ITheatre.js";

export default interface ITheatreDetails extends ITheatre {
    screenCount: number;
    seatCount: number;
    futureShowingCount: number;
}