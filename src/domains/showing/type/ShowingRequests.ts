import type {Request} from "express";

interface IShowingSeatingQueryFilters {
    populate?: boolean;
    mapped?: boolean;
}

export type ShowingSeatQueryRequest = Request<any, any, any, IShowingSeatingQueryFilters>;