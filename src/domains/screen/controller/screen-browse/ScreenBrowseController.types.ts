import type {Request, Response} from "express";
import type {ScreenSearchService} from "../../service/screen-search-service/ScreenSearchService.js";
import type {BaseConstructorParams} from "../../../../shared/controller/BaseController.js";

export type ScreenBrowseConstructor = BaseConstructorParams & {
    searchService: ScreenSearchService;
}

export interface ScreenBrowseControllerMethods {
    fetchShowingsByScreens(req: Request, res: Response): Promise<Response>;
}