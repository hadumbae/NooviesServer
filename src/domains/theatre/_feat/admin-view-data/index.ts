import {fetchTheatreScreenData} from "@domains/theatre/_feat/admin-view-data/service/service";
import type {
    FetchTheatreScreenDataConfig,
    TheatreScreenData
} from "@domains/theatre/_feat/admin-view-data/service/service.types";
import {getFetchTheatreScreenViewData} from "@domains/theatre/_feat/admin-view-data/controller";
import {
    type TheatreScreenViewRouteConfig,
    TheatreScreenViewRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreScreenViewRouteConfigSchema";
import {TheatreAdminViewDataRoutes} from "@domains/theatre/_feat/admin-view-data/routes";

export {
    fetchTheatreScreenData,
    getFetchTheatreScreenViewData,
    TheatreScreenViewRouteConfigSchema,
    TheatreAdminViewDataRoutes,
}
export type {
    FetchTheatreScreenDataConfig,
    TheatreScreenData,
    TheatreScreenViewRouteConfig,
}