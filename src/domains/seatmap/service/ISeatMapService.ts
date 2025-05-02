import type {FilterQuery} from "mongoose";
import type ISeatMap from "../model/ISeatMap.js";
import type {PopulateQueryFilters} from "../../../shared/types/mongoose/MongooseAggregateTypes.js";
import type {PaginationReturns} from "../../../shared/types/PaginationReturns.js";
import type {ZSeatMap} from "../schema/SeatMapSchema.js";

export interface GetShowingSeatMapParams {
    showingID: string,
    page: number,
    perPage: number,
    matchFilters?: FilterQuery<ISeatMap>,
    populateFilters?: PopulateQueryFilters,
}

export default interface ISeatMapService {
    getShowingSeatMap(params: GetShowingSeatMapParams): Promise<PaginationReturns<ZSeatMap>>
    createShowingSeatMap(params: {showingID: string}): Promise<void>;
    toggleSeatMapAvailability(params: {seatMapID: string}): Promise<ZSeatMap>;
}