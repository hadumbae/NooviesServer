import {type ScreenQuery, ScreenQuerySchema} from "../schema/query/ScreenQuerySchema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {ScreenQueryRequest, ScreenShowingQueryRequest} from "../type/request/CustomScreenRequests.js";
import {type ScreenShowingQuery, ScreenShowingQuerySchema} from "../schema/query/ScreenShowingQuerySchema.js";

export interface IScreenQueryService {
    fetchQuery(req: ScreenQueryRequest): ScreenQuery;
    fetchShowingQuery(req: ScreenShowingQueryRequest): ScreenShowingQuery;
}

export default class ScreenQueryService implements IScreenQueryService {
    fetchQuery(req: ScreenQueryRequest): ScreenQuery {
        const conditions = ScreenQuerySchema.parse(req.query);
        return filterNullArray(conditions);
    }

    fetchShowingQuery(req: ScreenShowingQueryRequest): ScreenShowingQuery {
        const conditions = ScreenShowingQuerySchema.parse(req.query);
        return filterNullArray(conditions);
    }
}