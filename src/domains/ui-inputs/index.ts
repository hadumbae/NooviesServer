import {UIInputDataRoutes} from "@domains/ui-inputs/routes";
import {
    getFetchMovieLeanData,
    getFetchPersonLeanData, getFetchRoleTypeLeanData,
    handleLeanData,
    type LeanDataHandler
} from "@domains/ui-inputs/controller";
import type {FetchLeanDataConfig} from "@domains/ui-inputs/handlers/service.types";
import {fetchLeanMovies, fetchLeanPersons, fetchLeanRoleTypes} from "@domains/ui-inputs/handlers/service";

export {
    UIInputDataRoutes,
    handleLeanData,
}

export {
    fetchLeanMovies,
    fetchLeanPersons,
    fetchLeanRoleTypes,
}

export {
    getFetchMovieLeanData,
    getFetchPersonLeanData,
    getFetchRoleTypeLeanData,
}

export type {
    FetchLeanDataConfig,
    LeanDataHandler,
}