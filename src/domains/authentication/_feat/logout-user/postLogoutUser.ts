/**
 * @fileoverview Express controller for logging out users and clearing authentication cookies.
 */

import type {Request, Response} from "express";

/** Clears authentication cookies to log out the user. */
export async function postLogoutUser(req: Request, res: Response): Promise<Response> {
    return res
        .status(200)
        .clearCookie("hasAuthToken")
        .clearCookie("authToken")
        .json({message: "Logged out."});
}