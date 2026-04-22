import type {
    FetchTheatreByLocationConfig,
    TheatreByLocationReturns
} from "@domains/theatre/_feat/search-theatres/service/service.types";
import {fetchTheatresByLocation} from "@domains/theatre/_feat/search-theatres/service/service";
import {getFetchTheatresByLocation} from "@domains/theatre/_feat/search-theatres/controller";
import {TheatreSearchRoutes} from "@domains/theatre/_feat/search-theatres/routes";
import {
    type TheatresByLocationRouteConfig,
    TheatresByLocationRouteConfigSchema
} from "@domains/theatre/_feat/search-theatres/schemas/TheatresByLocationRouteConfigSchema";

export {
    fetchTheatresByLocation,
    getFetchTheatresByLocation,
    TheatreSearchRoutes,
    TheatresByLocationRouteConfigSchema,
}

export type {
    FetchTheatreByLocationConfig,
    TheatreByLocationReturns,
    TheatresByLocationRouteConfig,
}

