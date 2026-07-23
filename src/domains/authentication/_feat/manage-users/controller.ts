/**
 * @fileoverview Express controllers for managing user authentication and administrative status.
 */

import type {Request, Response} from "express";
import type {UserRegisterInput} from "@/domains/authentication/_feat/register-user/UserRegisterInputSchema";
import createHttpError from "http-errors";
import {
    grantAdminStatus,
    loginUser,
    type ManageUserRouteConfig,
    registerUser,
    revokeAdminStatus
} from "@/domains/authentication/_feat";
import type {UserLoginInput} from "@/domains/authentication/_feat/login-user/UserLoginInputSchema";

/** Registers a new user account and returns a success message. */
export async function postRegisterUser(req: Request, res: Response): Promise<Response> {
    const data = req.validatedBody as UserRegisterInput;
    if (!data) throw createHttpError(400, "Missing Request Data.");

    await registerUser({data});

    return res.status(200).json({message: "Registered successfully. Proceed to Login."});
}

/** Authenticates a user and sets an HTTP-only JWT cookie. */
export async function postLoginUser(req: Request, res: Response): Promise<Response> {
    const data = req.validatedBody as UserLoginInput;
    if (!data) throw createHttpError(400, "Missing Request Data.");

    const loginData = await loginUser({data});
    const cookieOptions = {secure: false, maxAge: 86400000};

    return res
        .status(200)
        .cookie("hasAuthToken", true, cookieOptions)
        .cookie("authToken", loginData.token, {httpOnly: true, ...cookieOptions})
        .json(loginData.user);
}

/** Clears authentication cookies to log out the user. */
export async function postLogoutUser(req: Request, res: Response): Promise<Response> {
    return res
        .status(200)
        .clearCookie("hasAuthToken")
        .clearCookie("authToken")
        .json({message: "Logged out."});
}

/** Returns the authentication ID and administrative status of the current user. */
export async function getVerifyAdminStatus(req: Request, res: Response): Promise<Response> {
    const {authUserID, authUserAdmin} = req;
    return res.status(200).json({userID: authUserID, isAdmin: authUserAdmin});
}

/** Grants administrative privileges to a specific user by their ID. */
export async function postGrantAdminStatus(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRouteConfig;

    await grantAdminStatus(userId);

    return res.status(200).json({message: "User Admin Status granted successfully."});
}

/** Revokes administrative privileges from a specific user by their ID. */
export async function postRevokeAdminStatus(req: Request, res: Response): Promise<Response> {
    const {userId} = req.parsedConfig as ManageUserRouteConfig;

    await revokeAdminStatus(userId);

    return res.status(200).json({message: "User Admin Status revoked successfully."});
}