import type {ZScreen} from "../schema/ScreenSchema.js";
import {Types} from "mongoose";
import Screen from "../model/Screen.js";
import type {PaginationReturns} from "../../../shared/types/PaginationReturns.js";

export interface IScreenService {
    fetchPaginatedScreensByTheatre(
        params: {
            theatreID: Types.ObjectId | string,
            page?: number,
            perPage?: number,
            showingsPerScreen?: number,
            sort?: Record<string, any>,
            lean?: boolean,
        }
    ): Promise<PaginationReturns<ZScreen>>;
}

export default class ScreenService implements IScreenService {
    async fetchPaginatedScreensByTheatre(params: {
        theatreID: Types.ObjectId | string,
        page?: number,
        perPage?: number,
        showingsPerScreen?: number,
        sort?: Record<string, any>,
        lean?: boolean,
    }): Promise<any> {
        const {
            theatreID,
            page = 1, perPage = 10, showingsPerScreen = 3,
            sort = {}, lean
        } = params;

        const query = Screen
            .find({theatre: theatreID})
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate({
                populate: {path: "movie"},
                path: "showings",
                match: {isActive: true},
                options: {sort: {startTime: -1}, limit: showingsPerScreen},
            });

        if (lean) query.lean();

        return query;
    }
}