import type { Request, Response } from "express";
import type { AuthServiceMethods } from "../service/AuthService.types.js";

/**
 * Constructor type for an authentication controller.
 *
 * @property service - Instance of an AuthService implementing `AuthServiceMethods`.
 */
export type AuthControllerConstructor = {
    service: AuthServiceMethods;
};

/**
 * Interface defining the methods available in the authentication controller.
 *
 * Provides methods for:
 * - Registering a new user
 * - Logging in
 * - Logging out
 * - Toggling admin roles
 * - Verifying admin status
 *
 * @example
 * ```ts
 * const authController: AuthControllerMethods = getAuthController();
 *
 * await authController.register(req, res);
 * await authController.login(req, res);
 * authController.logout(req, res);
 * await authController.toggleAdmin(req, res);
 * await authController.verifyAdminStatus(req, res);
 * ```
 */
export interface AuthControllerMethods {
    /** Registers a new user and sends the response. */
    register(req: Request, res: Response): Promise<Response>;

    /** Logs in a user and returns user credentials in the response. */
    login(req: Request, res: Response): Promise<Response>;

    /** Logs out the user and clears authentication cookies. */
    logout(req: Request, res: Response): Response;

    /** Toggles the admin role for a user and returns the updated user. */
    toggleAdmin(req: Request, res: Response): Promise<Response>;

    /** Verifies whether the current user has admin privileges. */
    verifyAdminStatus(req: Request, res: Response): Promise<Response>;
}
