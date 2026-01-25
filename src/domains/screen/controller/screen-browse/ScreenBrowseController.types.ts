import type {Request, Response} from "express";
import type {ScreenSearchService} from "../../service/screen-search-service/ScreenSearchService.js";
import type {IBaseControllerConstructor} from "../../../../shared/controller/BaseController.js";

export type ScreenBrowseConstructor = IBaseControllerConstructor & {
    searchService: ScreenSearchService;
}

export interface ScreenBrowseControllerMethods {
    fetchShowingsByScreens(req: Request, res: Response): Promise<Response>;
}