import {fetchTheatreInfoViewData} from "./theatre-info/theatreInfo.service";
import type {FetchTheatreInfoViewDataConfig, TheatreInfoViewData} from "./theatre-info/theatreInfo.service.types";
import {
    type FetchTheatreInfoViewRouteConfig,
    FetchTheatreInfoViewRouteConfigSchema
} from "@domains/theatre/_feat/client-view-data/theatre-info/routeParams";
import {getFetchTheatreInfoViewData} from "@domains/theatre/_feat/client-view-data/controller";
import {TheatreClientViewDataRoutes} from "@domains/theatre/_feat/client-view-data/routes";

export {
    fetchTheatreInfoViewData,
    FetchTheatreInfoViewRouteConfigSchema,
    getFetchTheatreInfoViewData,
    TheatreClientViewDataRoutes,
}

export type {
    FetchTheatreInfoViewDataConfig,
    TheatreInfoViewData,
    FetchTheatreInfoViewRouteConfig,
}

