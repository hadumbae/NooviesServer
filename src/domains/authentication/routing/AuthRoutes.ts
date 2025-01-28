import {Router as ExpressRouter} from "express";
import  type {Router} from "express";

import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import zodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";

import isAuth from "../middleware/isAuth.js";
import AuthServiceProvider from "../provider/AuthServiceProvider.js";

import {UserLoginSchema} from "../schema/UserLoginSchema.js";
import {UserRegisterSubmitSchema} from "../schema/UserRegisterSubmitSchema.js";

const router: Router = ExpressRouter();
const { controller } = AuthServiceProvider.register();

// API - /auth/register
router.post(
    "/register",
    zodAsyncValidator(UserRegisterSubmitSchema),
    asyncHandler(controller.register.bind(controller)),
);

// API - /auth/login
router.post(
    "/login",
    zodAsyncValidator(UserLoginSchema),
    asyncHandler(controller.login.bind(controller)),
);

// API - /auth/logout
router.post(
    "/logout",
    isAuth,
    asyncHandler(controller.logout.bind(controller)),
);

// API - /auth/admin/verify
router.get(
    "/admin/verify",
    isAuth,
    asyncHandler(controller.verifyAdminStatus.bind(controller)),
);

// API - /auth/admin/toggle/_id
router.post(
    "/admin/toggle/:_id",
    isAuth,
    asyncHandler(controller.toggleAdmin.bind(controller)),
);

export default router;
