/**
 * @fileoverview Express controller for handling the retrieval of theatre information.
 */

import type { Request, Response } from "express";
import type {FetchTheatreInfoViewRouteConfig} from "@/domains/theatre/_feat/client-view-data/theatre-info/FetchTheatreInfoViewRouteConfigSchema";

import {
    fetchTheatreInfoViewData
} from "@/domains/theatre/_feat/client-view-data/theatre-info/fetchTheatreInfoViewData";

/**
 * Handles the HTTP request for retrieving client-facing theatre information.
 */
export async function getFetchTheatreInfoViewData(
    req: Request, res: Response
): Promise<Response> {
    const {theatreSlug, localDateString, limit} = req.parsedConfig as FetchTheatreInfoViewRouteConfig;
    console.log("Local Date String:", localDateString);

    const data = await fetchTheatreInfoViewData({theatreSlug, localDateString, limit});
    return res.status(200).json(data);
}