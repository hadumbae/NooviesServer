import type {Request, Response} from "express";
import type {ScreenSearchService} from "./ScreenSearchService";
import type {BaseConstructorParams} from "@shared/controller/BaseController";

export type ScreenBrowseConstructor = BaseConstructorParams & {
    searchService: ScreenSearchService;
}

export interface ScreenBrowseControllerMethods {
    fetchShowingsByScreens(req: Request, res: Response): Promise<Response>;
}