/**
 * @fileoverview Express controller for logging out users and clearing authentication cookies.
 */

import type {Request, Response} from "express";
import {clearRefreshTokens} from "@/domains/authentication/_feat/manage-refresh-tokens";

/** Clears authentication cookies to log out the user. */
export async function postLogoutUser(req: Request, res: Response): Promise<Response> {
    req.authUserID && await clearRefreshTokens({userId: req.authUserID});

    return res
        .status(200)
        .clearCookie("hasAuthToken")
        .clearCookie("authToken")
        .clearCookie("refreshToken")
        .json({message: "Logged out."});
}