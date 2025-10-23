import {Router as ExpressRouter} from "express";
import  type {Router} from "express";

import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";

import isAuth from "../middleware/isAuth.js";
import AuthServiceProvider from "../provider/AuthServiceProvider.js";

import {UserLoginSchema} from "../schema/UserLoginSchema.js";
import {UserRegisterSubmitSchema} from "../schema/UserRegisterSubmitSchema.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";

const router: Router = ExpressRouter();
const { controller } = AuthServiceProvider.register();

// API - /auth/register
router.post(
    "/register",
    validateZodSchema(UserRegisterSubmitSchema),
    asyncHandler(controller.register.bind(controller)),
);

// API - /auth/login
router.post(
    "/login",
    validateZodSchemaAsync(UserLoginSchema),
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
