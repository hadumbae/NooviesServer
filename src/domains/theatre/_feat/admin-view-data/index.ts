import {
    fetchTheatreDetailsViewData,
    fetchTheatreScreenData, fetchTheatreShowingListViewData
} from "@domains/theatre/_feat/admin-view-data/service/service";
import type {
    FetchTheatreDetailsViewDataConfig,
    FetchTheatreScreenDataConfig, FetchTheatreShowingListViewDataConfig, TheatreDetailsViewData,
    TheatreScreenData, TheatreShowingListViewData
} from "@domains/theatre/_feat/admin-view-data/service/service.types";
import {
    getFetchTheatreDetailsViewData,
    getFetchTheatreScreenViewData, getFetchTheatreShowingListViewData
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
import {
    type TheatreShowingListRouteConfig,
    TheatreShowingListRouteConfigSchema
} from "@domains/theatre/_feat/admin-view-data/schemas/TheatreShowingListRouteConfigSchema";

export {
    fetchTheatreScreenData,
    getFetchTheatreScreenViewData,
    TheatreScreenViewRouteConfigSchema,
    TheatreAdminViewDataRoutes,
    TheatreDetailsViewRouteConfigSchema,
    fetchTheatreDetailsViewData,
    getFetchTheatreDetailsViewData,
    TheatreShowingListRouteConfigSchema,
    fetchTheatreShowingListViewData,
    getFetchTheatreShowingListViewData,
}

export type {
    FetchTheatreScreenDataConfig,
    TheatreScreenData,
    TheatreScreenViewRouteConfig,
    TheatreDetailsViewRouteConfig,
    FetchTheatreDetailsViewDataConfig,
    TheatreDetailsViewData,
    TheatreShowingListRouteConfig,
    FetchTheatreShowingListViewDataConfig,
    TheatreShowingListViewData,
}

