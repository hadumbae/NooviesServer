import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {parseQueryOptions} from "@shared/_feat/middleware";
import {MovieQueryOptionsSchema} from "@domains/movie/_feat/validate-query";
import {getFetchMovieLeanData} from "@domains/ui-inputs/controller";

const router = Router();

router.get(
    '/movies',
    [isAuth, parseQueryOptions({schema: MovieQueryOptionsSchema})],
    asyncHandler(getFetchMovieLeanData),
);

export {
    router as UIInputDataRoutes,
}