import {
    fetchTheatreDetailsViewData,
    fetchTheatreScreenData
} from "@domains/theatre/_feat/admin-view-data/service/service";
import type {
    FetchTheatreDetailsViewDataConfig,
    FetchTheatreScreenDataConfig, TheatreDetailsViewData,
    TheatreScreenData
} from "@domains/theatre/_feat/admin-view-data/service/service.types";
import {
    getFetchTheatreDetailsViewData,
    getFetchTheatreScreenViewData
} from "@domains/theatre/_feat/admin-view-data/controller";
import {
    type TheatreScreenViewRouteConfig,
    TheatreScreenViewRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreScreenViewRouteConfigSchema";
import {TheatreAdminViewDataRoutes} from "@domains/theatre/_feat/admin-view-data/routes";
import {
    type TheatreDetailsViewRouteConfig,
    TheatreDetailsViewRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreDetailsViewRouteConfigSchema";

export {
    fetchTheatreScreenData,
    getFetchTheatreScreenViewData,
    TheatreScreenViewRouteConfigSchema,
    TheatreAdminViewDataRoutes,
    TheatreDetailsViewRouteConfigSchema,
    fetchTheatreDetailsViewData,
    getFetchTheatreDetailsViewData,
}

export type {
    FetchTheatreScreenDataConfig,
    TheatreScreenData,
    TheatreScreenViewRouteConfig,
    TheatreDetailsViewRouteConfig,
    FetchTheatreDetailsViewDataConfig,
    TheatreDetailsViewData,
}