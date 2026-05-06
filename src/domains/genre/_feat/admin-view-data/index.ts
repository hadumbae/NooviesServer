import {GenreViewDataRoutes} from "@domains/genre/_feat/admin-view-data/routes";
import {fetchGenreDetails} from "./services/service";
import type {FetchGenreDetailsViewConfig, FetchGenreDetailsViewReturns} from "./services/service.types";
import {getFetchGenreDetailsViewData} from "@domains/genre/_feat/admin-view-data/controller";
import {
    type GenreDetailsViewRouteConfig,
    GenreDetailsViewRouteConfigSchema
} from "@domains/genre/_feat/admin-view-data/schemas/GenreDetailsViewRouteConfigSchema";

export {
    GenreViewDataRoutes,
    fetchGenreDetails,
    getFetchGenreDetailsViewData,
    GenreDetailsViewRouteConfigSchema,
}

export type {
    FetchGenreDetailsViewConfig,
    FetchGenreDetailsViewReturns,
    GenreDetailsViewRouteConfig,
}

