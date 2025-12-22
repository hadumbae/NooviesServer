import UserServiceProvider from "../provider/UserServiceProvider.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import express from "express";
import isAuth from "../../authentication/middleware/isAuth.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import { UserPasswordUpdateInputSchema } from "../schema/UserPasswordUpdateInputSchema.js";

const { controller } = UserServiceProvider.register();
const routes = express.Router();

/**
 * Router for user-related API endpoints.
 *
 * Includes CRUD operations and user-specific actions such as updating passwords.
 * All routes require authentication via `isAuth` middleware.
 *
 * @example
 * ```ts
 * import userRoutes from './user.routes.js';
 * app.use('/users', userRoutes);
 * ```
 */

// --- CRUD Routes ---

/** Get all users */
routes.get('/all', [isAuth], asyncHandler(controller.all.bind(controller)));

/** Get a single user by ID */
routes.get('/get/:_id', [isAuth], asyncHandler(controller.get.bind(controller)));

/** Delete a user by ID */
routes.delete('/delete/:_id', [isAuth], asyncHandler(controller.delete.bind(controller)));

// --- Update Routes ---

/**
 * Update a user's password.
 *
 * Validates the request body using `UserPasswordUpdateInputSchema` and
 * delegates the operation to the controller.
 */
routes.patch(
    '/update/:_id/password',
    [isAuth, validateZodSchema(UserPasswordUpdateInputSchema)],
    asyncHandler(controller.updateUserPassword.bind(controller))
);

export default routes;
