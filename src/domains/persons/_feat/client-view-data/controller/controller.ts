/**
 * @fileoverview Controller for fetching composite person information and filmography data for client views.
 *
 */

import type {Request, Response} from "express";
import {type PersonInfoViewRouteConfig} from "@/domains/persons/_feat/client-view-data/person-info";
import {fetchRequiredPerson} from "@/domains/persons";
import {fetchPersonFilmography} from "@/domains/movie-credits";
import {
    type BrowsePersonRouteConfig,
    fetchBrowsePersonViewData
} from "@/domains/persons/_feat/client-view-data/browse-persons";

/**
 * Handles requests to retrieve a person's profile data and their associated movie credits.
 */
export async function getFetchPersonInfoViewData(
    req: Request, res: Response
): Promise<Response> {
    const {slug, limit} = req.parsedConfig as PersonInfoViewRouteConfig;

    const person = await fetchRequiredPerson({slug});
    const filmography = await fetchPersonFilmography({personID: person._id, limit});

    return res
        .status(200)
        .json({person, filmography});
}

/**
 * Handles requests to retrieve a paginated list of persons with optional filtering and sorting.
 */
export async function getFetchBrowsePersonViewData(
    req: Request, res: Response
): Promise<Response> {
    const {page, perPage} = req.parsedConfig as BrowsePersonRouteConfig;
    const matchStage = req.queryMatchStage;
    const sortStage = req.querySortStage;

    const data = await fetchBrowsePersonViewData({
        page,
        perPage,
        match: matchStage,
        sort: sortStage,
    });

    return res
        .status(200)
        .json(data);
}