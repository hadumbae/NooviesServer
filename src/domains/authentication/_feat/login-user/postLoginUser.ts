/**
 * @fileoverview Express controller for authenticating users and managing login sessions.
 */

import type {Request, Response} from "express";
import createHttpError from "http-errors";
import {loginUser} from "@/domains/authentication/_feat/login-user/loginUser";
import type {UserLoginInput} from "@/domains/authentication/_feat/login-user/UserLoginInputSchema";

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