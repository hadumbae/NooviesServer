import {
    type TheatreScreenDetailsViewRouteConfig,
    TheatreScreenDetailsViewRouteConfigSchema
} from "@domains/screen/_feat/view-data-admin/schemas/TheatreScreenDetailsViewRouteConfigSchema";
import type {
    FetchTheatreScreenDetailsViewDataConfig,
    TheatreScreenDetailsViewData
} from "@domains/screen/_feat/view-data-admin/service/service.types";
import {fetchTheatreScreenDetailsViewData} from "@domains/screen/_feat/view-data-admin/service/service";
import {getFetchTheatreScreenDetailsViewData} from "@domains/screen/_feat/view-data-admin/controller";
import {TheatreScreenAdminViewDataRoutes} from "@domains/screen/_feat/view-data-admin/routes";

export {
    TheatreScreenDetailsViewRouteConfigSchema,
    fetchTheatreScreenDetailsViewData,
    getFetchTheatreScreenDetailsViewData,
    TheatreScreenAdminViewDataRoutes,
}
export type {
    TheatreScreenDetailsViewRouteConfig,
    FetchTheatreScreenDetailsViewDataConfig,
    TheatreScreenDetailsViewData,
}

