import {Router as ExpressRouter} from "express";
import  type {Router} from "express";

import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import zodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";

import isAuth from "../middleware/isAuth.js";
import AuthServiceProvider from "../provider/AuthServiceProvider.js";

import {UserLoginSchema} from "../schema/UserLoginSchema.js";
import {UserRegisterSchema} from "../schema/UserRegisterSchema.js";

const router: Router = ExpressRouter();
const { controller } = AuthServiceProvider.register();

// API - /auth/register
router.post(
    "/register",
    zodAsyncValidator(UserRegisterSchema),
    asyncHandler(
        controller.register.bind(controller),
    ),
);

// API - /auth/login
router.post(
    "/login",
    zodAsyncValidator(UserLoginSchema),
    asyncHandler(
        controller.login.bind(controller),
    ),
);

// API - /auth/admin/toggle/_id
router.post(
    "/admin/toggle/:_id",
    isAuth,
    asyncHandler(
        controller.toggleAdmin.bind(controller),
    ),
);

export default router;
