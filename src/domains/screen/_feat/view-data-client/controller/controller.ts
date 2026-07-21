/**
 * @fileoverview Controller for handling client-side requests to view showing data by screen.
 */

import type {Request, Response} from "express";
import {validateRequestParameters} from "@/shared/utility/schema/validateRequestParameters";
import {fetchShowingsByScreens} from "@/domains/screen/_feat/view-data-client/service/fetchShowingsByScreens";
import {ShowingsByScreenQuerySchema} from "@/domains/screen/_feat/view-data-client/schema/ShowingsByScreenQuerySchema";

/**
 * Express controller that validates query parameters and returns showings grouped by screens for a specific theatre and date.
 */
export async function getFetchShowingsByScreens(req: Request, res: Response): Promise<Response> {
    const {theatreID, dateString} = validateRequestParameters({
        req,
        schema: ShowingsByScreenQuerySchema,
        errorMessage: "Invalid parameters. Must be a valid theatre and a valid date string.",
    });

    const data = await fetchShowingsByScreens({
        theatreID,
        dateString,
    });

    return res.status(200).json(data);
}
