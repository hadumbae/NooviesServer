import type {FilterQuery} from "mongoose";
import filterNullishAttributes from "../../../shared/utility/filterNullishAttributes.js";
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
        return filterNullishAttributes({populate, mapped});
    }
}