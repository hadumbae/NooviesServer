import {
    type PersonDetailsViewRouteConfig,
    PersonDetailsViewRouteConfigSchema
} from "@domains/person/_feat/admin-view-data/routeSchemas";
import type {
    FetchPersonDetailsViewData,
    FetchPersonDetailsViewDataConfig
} from "@domains/person/_feat/admin-view-data/service.types";
import {fetchPersonDetailsViewData} from "@domains/person/_feat/admin-view-data/service";
import {getFetchPersonDetailsViewData} from "@domains/person/_feat/admin-view-data/controller";
import {PersonAdminViewDataRoutes} from "@domains/person/_feat/admin-view-data/routes";


export {
    PersonDetailsViewRouteConfigSchema,
    fetchPersonDetailsViewData,
    getFetchPersonDetailsViewData,
    PersonAdminViewDataRoutes,
}

export type {
    PersonDetailsViewRouteConfig,
    FetchPersonDetailsViewDataConfig,
    FetchPersonDetailsViewData,
}
