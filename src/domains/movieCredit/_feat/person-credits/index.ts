import {fetchPersonFilmography} from "@domains/movieCredit/_feat/person-credits/service";
import type {
    FetchPersonFilmographyConfig,
    RoleCreditsGroup
} from "@domains/movieCredit/_feat/person-credits/service.types";
import {PersonCreditRoutes} from "@domains/movieCredit/_feat/person-credits/routes";
import {getFetchPersonFilmography} from "@domains/movieCredit/_feat/person-credits/controller";

export {
    fetchPersonFilmography,
    getFetchPersonFilmography,
    PersonCreditRoutes,
}
export type {
    FetchPersonFilmographyConfig,
    RoleCreditsGroup,
}

