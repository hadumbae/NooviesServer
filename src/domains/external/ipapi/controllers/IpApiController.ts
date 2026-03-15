/**
 * @file Controllers for IP API related endpoints.
 * @filename IpApiController.ts
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";
import {fetchRequestIP} from "../../../../shared/utility/request/fetchRequestIP.js";
import {fetchIPData} from "../services/IpApiService.js";

/**
 * Retrieves geolocation data for the requesting client IP.
 *
 * Resolves the client IP from the request and fetches geolocation
 * data using the Ipify service.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const fetchIpApiGeoData: ControllerAsyncFunc = async (req: Request, res: Response) => {
    const requestIP = fetchRequestIP(req);

    if (requestIP) {
        const geoData = await fetchIPData(requestIP);
        return res.status(200).json(geoData);
    }

    return res.status(400).json({message: "Invalid IP."});
};