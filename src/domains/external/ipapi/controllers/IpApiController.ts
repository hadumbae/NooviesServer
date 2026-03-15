/**
 * @file Controllers for IP API related endpoints.
 * @filename IpApiController.ts
 */

import type {Request, Response} from "express";
import type {ControllerAsyncFunc} from "../../../../shared/types/ControllerTypes.js";

/**
 * Handles requests for IP-based geolocation data.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const fetchIpApiGeoData: ControllerAsyncFunc = async (req: Request, res: Response) => {
    return res.status(200).json({message: "Scaffold."});
};