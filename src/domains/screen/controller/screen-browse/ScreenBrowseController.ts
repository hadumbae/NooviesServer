import type {Request, Response} from "express";

// ScreenBrowseController
//      fetchPaginatedScreensWithShowings
//          - optional limit

import type {ScreenBrowseConstructor, ScreenBrowseControllerMethods} from "./ScreenBrowseController.types.js";
import BaseController from "../../../../shared/controller/BaseController.js";
import type {ScreenSearchService} from "../../service/screen-search-service/ScreenSearchService.js";
import {validateRequestParameters} from "../../../../shared/utility/schema/validateRequestParameters.js";
import {ShowingsByScreenQuerySchema} from "../../schema/browse/query/ShowingsByScreenQuerySchema.js";

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