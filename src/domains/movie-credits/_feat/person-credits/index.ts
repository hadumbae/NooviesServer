import {fetchPersonCreditStats, fetchPersonFilmography} from "@/domains/movie-credits/_feat/person-credits/service";
import type {
    FetchPersonCreditStatsConfig,
    FetchPersonFilmographyConfig, PersonCreditStats,
    RoleCreditsGroup
} from "@/domains/movie-credits/_feat/person-credits/service.types";
import {PersonCreditRoutes} from "@/domains/movie-credits/_feat/person-credits/routes";
import {
    getFetchPersonCreditStats,
    getFetchPersonFilmography
} from "@/domains/movie-credits/_feat/person-credits/controller";
import {
    type FetchPersonCreditStatsRouteConfig,
    FetchPersonCreditStatsRouteConfigSchema
} from "@/domains/movie-credits/_feat/person-credits/routeSchemas";

export {
    fetchPersonFilmography,
    getFetchPersonFilmography,
    PersonCreditRoutes,
    fetchPersonCreditStats,
    FetchPersonCreditStatsRouteConfigSchema,
    getFetchPersonCreditStats,
}

export type {
    FetchPersonFilmographyConfig,
    RoleCreditsGroup,
    FetchPersonCreditStatsConfig,
    PersonCreditStats,
    FetchPersonCreditStatsRouteConfig,
}
