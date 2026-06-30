import {GenreViewDataRoutes} from "@/domains/genres/_feat/admin-view-data/routes";
import {fetchGenreDetails} from "@/domains/genres/_feat/admin-view-data/services/service";
import {getFetchGenreDetailsViewData} from "@/domains/genres/_feat/admin-view-data/controller";
import type {
    FetchGenreDetailsViewConfig,
    FetchGenreDetailsViewReturns
} from "@/domains/genres/_feat/admin-view-data/services/service.types";
import {
    type GenreDetailsViewRouteConfig,
    GenreDetailsViewRouteConfigSchema
} from "@/domains/genres/_feat/admin-view-data/schemas/GenreDetailsViewRouteConfigSchema";

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

