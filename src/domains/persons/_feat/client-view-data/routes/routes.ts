import {Router} from "express";
import {Person} from "@/domains/persons/_models";
import {parseQueryMatchStage, parseQuerySortStage} from "@/shared/_feat/middleware";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {
    getFetchBrowsePersonViewData,
    getFetchPersonInfoViewData,
} from "@/domains/persons/_feat/client-view-data/controller";
import {
    BrowsePersonRouteConfigSchema,
    BrowsePersonsQueryMatchStageSchema,
    BrowsePersonsQuerySortStageSchema
} from "@/domains/persons/_feat/client-view-data/browse-persons";
import {PersonInfoViewRouteConfigSchema} from "@/domains/persons/_feat/client-view-data/person-info";

const routes = Router();
const modelName = Person.modelName;

routes.get(
    "/browse",
    [
        isAuth,
        validateRequestConfig({schema: BrowsePersonRouteConfigSchema, errorMessage: "Invalid pagination values."}),
        parseQueryMatchStage({schema: BrowsePersonsQueryMatchStageSchema, modelName}),
        parseQuerySortStage({schema: BrowsePersonsQuerySortStageSchema, modelName}),
    ],
    asyncHandler(getFetchBrowsePersonViewData),
);

routes.get(
    "/person/:slug/info",
    [
        isAuth,
        validateRequestConfig({schema: PersonInfoViewRouteConfigSchema, errorMessage: "Invalid slug or limit values."}),
    ],
    asyncHandler(getFetchPersonInfoViewData),
);

export {
    routes as PersonClientViewDataRoutes
}