import type {Request, Response} from "express";
import {validateRequestParameters} from "@/shared/utility/schema/validateRequestParameters";
import {ShowingsByScreenQuerySchema} from "../schema/ShowingsByScreenQuerySchema";
import {fetchShowingsByScreens} from "@/domains/screen/_feat/view-data-client/service/fetchShowingsByScreens";


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
