import {UIInputDataRoutes} from "@domains/ui-inputs/routes";
import {getFetchMovieLeanData, handleLeanData, type LeanDataHandler} from "@domains/ui-inputs/controller";
import type {FetchLeanDataConfig} from "@domains/ui-inputs/handlers/service.types";

export {
    UIInputDataRoutes,
    handleLeanData,
    getFetchMovieLeanData,
}

export type {
    FetchLeanDataConfig,
    LeanDataHandler,
}