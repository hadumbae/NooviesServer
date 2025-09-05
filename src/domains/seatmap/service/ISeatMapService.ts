import type {FilterQuery} from "mongoose";
import type ISeatMap from "../model/ISeatMap.js";
import type {
    ReferenceFilterPipelineStages
} from "../../../shared/types/mongoose/AggregatePipelineStages.js";
import type {PaginationReturns} from "../../../shared/types/PaginationReturns.js";

export interface GetShowingSeatMapParams {
    showingID: string,
    page: number,
    perPage: number,
    matchFilters?: FilterQuery<ISeatMap>,
    populateFilters?: ReferenceFilterPipelineStages,
}

export default interface ISeatMapService {
    getShowingSeatMap(params: GetShowingSeatMapParams): Promise<PaginationReturns<ISeatMap>>
    createShowingSeatMap(params: {showingID: string}): Promise<void>;
    toggleSeatMapAvailability(params: {seatMapID: string}): Promise<ISeatMap>;
}