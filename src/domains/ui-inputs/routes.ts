import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {parseQueryOptions} from "@shared/_feat/middleware";
import {MovieQueryOptionsSchema} from "@domains/movie/_feat/validate-query";
import {getFetchMovieLeanData, getFetchPersonLeanData, getFetchRoleTypeLeanData} from "@domains/ui-inputs/controller";
import {PersonQueryOptionsSchema} from "@domains/person/_feat/validate-query";
import {RoleTypeQueryOptionsSchema} from "@domains/roleType/_feat/validate-query";

const router = Router();

router.get(
    '/movies',
    [isAuth, parseQueryOptions({schema: MovieQueryOptionsSchema})],
    asyncHandler(getFetchMovieLeanData),
);

router.get(
    '/persons',
    [isAuth, parseQueryOptions({schema: PersonQueryOptionsSchema})],
    asyncHandler(getFetchPersonLeanData),
);

router.get(
    '/role-types',
    [isAuth, parseQueryOptions({schema: RoleTypeQueryOptionsSchema})],
    asyncHandler(getFetchRoleTypeLeanData),
);

export {
    router as UIInputDataRoutes,
}