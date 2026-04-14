import {GenreViewDataRoutes} from "@domains/genre/_feat/view-data/routes";
import {fetchGenreDetails} from "@domains/genre/_feat/view-data/service";
import type {
    FetchGenreDetailsViewParams,
    FetchGenreDetailsViewReturns
} from "@domains/genre/_feat/view-data/service.types";
import {getFetchGenreDetailsVeiwData} from "@domains/genre/_feat/view-data/controller";

export {
    GenreViewDataRoutes,
    fetchGenreDetails,
    getFetchGenreDetailsVeiwData,
}

export type {
    FetchGenreDetailsViewParams,
    FetchGenreDetailsViewReturns,
}