import {
    fetchMovieInfoShowingsViewData,
    type FetchMovieInfoShowingsViewDataConfig,
    type MovieInfoShowingsViewData
} from "@/domains/movies/_feat/client-view-data/utils/fetchMovieInfoShowingsViewData";
import {
    type CategoryGroupedCredits,
    fetchCreditsForMovie,
    type GroupedCreditsForMovieData
} from "@/domains/movies/_feat/client-view-data/utils/fetchCreditsForMovie";
import {
    fetchMovieInfoCreditsViewData,
    type FetchMovieInfoCreditsViewDataConfig,
    type MovieInfoCreditsViewData
} from "@/domains/movies/_feat/client-view-data/utils/fetchMovieInfoCreditsViewData";
import {
    fetchMovieInfoOverviewViewData,
    type FetchMovieInfoOverviewViewDataConfig,
    type MovieInfoOverviewViewData
} from "@/domains/movies/_feat/client-view-data/utils/fetchMovieInfoOverviewViewData";
import {
    fetchShowingsForMovie,
    type FetchShowingsForMovieConfig,
    type PaginatedShowingsForMovie
} from "@/domains/movies/_feat/client-view-data/utils/fetchShowingsForMovie";


export {
    fetchCreditsForMovie,
    fetchShowingsForMovie,
    fetchMovieInfoShowingsViewData,
    fetchMovieInfoCreditsViewData,
    fetchMovieInfoOverviewViewData,
}

export type {
    CategoryGroupedCredits,
    GroupedCreditsForMovieData,

    FetchShowingsForMovieConfig,
    PaginatedShowingsForMovie,

    FetchMovieInfoShowingsViewDataConfig,
    FetchMovieInfoCreditsViewDataConfig,
    FetchMovieInfoOverviewViewDataConfig,

    MovieInfoShowingsViewData,
    MovieInfoCreditsViewData,
    MovieInfoOverviewViewData,
}