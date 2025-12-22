import type { Request, Response } from 'express';
import createHttpError from "http-errors";
import type { UserRegisterInput } from "../schema/UserRegisterInputSchema.js";
import type { AuthServiceMethods } from "../service/AuthService.types.js";
import type { UserLoginInput } from "../schema/UserLoginInputSchema.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type { AuthControllerConstructor, AuthControllerMethods } from "./AuthControllerMethods.js";

/**
 * Controller class for handling authentication routes.
 *
 * Implements `AuthControllerMethods` and provides route handlers for:
 * - User registration
 * - User login
 * - User logout
 * - Toggling admin roles
 * - Verifying admin status
 *
 * @example
 * ```ts
 * import AuthController from './AuthController.js';
 * import AuthService from '../service/AuthService.js';
 *
 * const authService = new AuthService();
 * const authController = new AuthController({ service: authService });
 *
 * app.post('/register', authController.register);
 * app.post('/login', authController.login);
 * app.post('/logout', authController.logout);
 * app.patch('/users/:_id/admin', authController.toggleAdmin);
 * app.get('/users/admin-status', authController.verifyAdminStatus);
 * ```
 */
export default class AuthController implements AuthControllerMethods {
    /** Instance of the authentication service implementing business logic. */
    private service: AuthServiceMethods;

    /**
     * Creates a new AuthController.
     *
     * @param param0 - Constructor object containing the auth service.
     */
    constructor({ service }: AuthControllerConstructor) {
        this.service = service;
    }

    /**
     * Handles user registration requests.
     *
     * @param req - Express request object, expects validated body of type `UserRegisterInput`.
     * @param res - Express response object.
     * @returns JSON response confirming registration.
     * @throws HttpError 400 if request body is missing.
     */
    async register(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody as UserRegisterInput;
        if (!data) throw createHttpError(400, "Missing Request Data.");

        await this.service.register(data);

        return res.status(200).json({ message: "Registered successfully. Proceed to Login." });
    }

    /**
     * Handles user login requests.
     *
     * @param req - Express request object, expects validated body of type `UserLoginInput`.
     * @param res - Express response object.
     * @returns JSON response including user credentials and sets auth cookies.
     * @throws HttpError 400 if request body is missing.
     */
    async login(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody as UserLoginInput;
        if (!data) throw createHttpError(400, "Missing Request Data.");

        const loginData = await this.service.login(data);
        const cookieOptions = { secure: false, maxAge: 86400000 };

        return res
            .status(200)
            .cookie("hasAuthToken", true, cookieOptions)
            .cookie("authToken", loginData.token, { httpOnly: true, ...cookieOptions })
            .json(loginData);
    }

    /**
     * Handles user logout requests.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns JSON response confirming logout and clears auth cookies.
     */
    logout(req: Request, res: Response): Response {
        return res
            .status(200)
            .clearCookie("hasAuthToken")
            .clearCookie("authToken")
            .json({ message: "Logged out." });
    }

    /**
     * Verifies the current user's admin status.
     *
     * @param req - Express request object with `authUserID` and `authUserAdmin` set by auth middleware.
     * @param res - Express response object.
     * @returns JSON response including the user's ID and admin status.
     */
    async verifyAdminStatus(req: Request, res: Response): Promise<Response> {
        const { authUserID, authUserAdmin } = req;
        return res.status(200).json({ userID: authUserID, isAdmin: authUserAdmin });
    }

    /**
     * Toggles the admin role for a specific user.
     *
     * @param req - Express request object with a user `_id` parameter.
     * @param res - Express response object.
     * @returns JSON response confirming the role toggle.
     * @throws HttpError 400 if `_id` is invalid.
     */
    async toggleAdmin(req: Request, res: Response): Promise<Response> {
        const { _id } = req.params;
        const userID = isValidObjectId(_id);

        await this.service.toggleAdmin(userID);

        return res.status(200).json({ message: "User Admin Status toggled successfully." });
    }
}
