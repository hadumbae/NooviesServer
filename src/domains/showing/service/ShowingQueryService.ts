import type {FilterQuery} from "mongoose";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {ShowingSeatQueryRequest} from "../type/ShowingRequests.js";
import {
    type ShowingSeatQuery,
    ShowingSeatQuerySchema
} from "../schema/query/ShowingSeatQuerySchema.js";

export interface IShowingQueryService {
    getShowingSeatsQuery(params: {req: ShowingSeatQueryRequest}): FilterQuery<ShowingSeatQuery>;
}

export default class ShowingQueryService implements IShowingQueryService {
    getShowingSeatsQuery(params: {req: ShowingSeatQueryRequest}): FilterQuery<ShowingSeatQuery> {
        const {req} = params;
        const {populate = false, mapped = false} = ShowingSeatQuerySchema.parse(req.query);
        return filterNullArray({populate, mapped});
    }
}