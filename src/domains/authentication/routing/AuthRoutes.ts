import { Router as ExpressRouter } from "express";
import type { Router } from "express";

import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";

import isAuth from "../middleware/isAuth.js";
import AuthServiceProvider from "../provider/AuthServiceProvider.js";

import { UserLoginInputSchema } from "../schema/UserLoginInputSchema.js";
import { UserRegisterInputSchema } from "../schema/UserRegisterInputSchema.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";

const router: Router = ExpressRouter();
const { controller } = AuthServiceProvider.register();

/**
 * Express router for authentication-related routes.
 *
 * Handles registration, login, logout, and admin-related operations.
 *
 * @remarks
 * The following endpoints are available:
 * - POST `/auth/register` : Register a new user
 * - POST `/auth/login` : Log in an existing user
 * - POST `/auth/logout` : Log out the current user
 * - GET `/auth/admin/verify` : Verify if the current user has admin privileges
 * - POST `/auth/admin/toggle/:_id` : Toggle the admin role for a specific user
 *
 * All async route handlers are wrapped using `asyncHandler` to catch errors.
 * Request bodies are validated using Zod schemas before controller methods are called.
 *
 * @example
 * ```ts
 * import authRouter from './auth.routes.js';
 * app.use('/auth', authRouter);
 * ```
 */

// API - /auth/register
router.post(
    "/register",
    validateZodSchema(UserRegisterInputSchema),
    asyncHandler(controller.register.bind(controller)),
);

// API - /auth/login
router.post(
    "/login",
    validateZodSchemaAsync(UserLoginInputSchema),
    asyncHandler(controller.login.bind(controller)),
);

// API - /auth/logout
router.post(
    "/logout",
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
