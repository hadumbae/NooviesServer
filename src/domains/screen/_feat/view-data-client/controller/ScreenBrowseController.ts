import type {Request, Response} from "express";

// ScreenBrowseController
//      fetchPaginatedScreensWithShowings
//          - optional limit

import type {ScreenBrowseConstructor, ScreenBrowseControllerMethods} from "./ScreenBrowseController.types";
import BaseController from "@shared/controller/BaseController";
import type {ScreenSearchService} from "../service/ScreenSearchService";
import {validateRequestParameters} from "@shared/utility/schema/validateRequestParameters";
import {ShowingsByScreenQuerySchema} from "../schema/ShowingsByScreenQuerySchema";

export class ScreenBrowseController extends BaseController implements ScreenBrowseControllerMethods {
    protected searchService: ScreenSearchService

    constructor({queryUtils, searchService}: ScreenBrowseConstructor) {
        super({queryUtils});

        this.searchService = searchService;
    }

    async fetchShowingsByScreens(req: Request, res: Response): Promise<Response> {
        const {theatreID, dateString} = validateRequestParameters({
            req,
            schema: ShowingsByScreenQuerySchema,
            errorMessage: "Invalid parameters. Must be a valid theatre and a valid date string.",
        });

        const data = await this.searchService.fetchShowingsByScreens({
            theatreID,
            dateString,
        });

        return res.status(200).json(data);
    }
}