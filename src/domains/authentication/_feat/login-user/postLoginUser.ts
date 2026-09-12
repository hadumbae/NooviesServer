/**
 * @fileoverview Express controller for authenticating users and managing login sessions.
 */

import type {Request, Response} from "express";
import createHttpError from "http-errors";
import {loginUser} from "@/domains/authentication/_feat/login-user/loginUser";
import type {UserLoginInput} from "@/domains/authentication/_feat/login-user/UserLoginInputSchema";
import {createRefreshToken} from "@/domains/authentication/_feat/manage-refresh-tokens";
import {fetchRequestIP} from "@/shared/utility/request/fetchRequestIP";
import {convertToMilliseconds, getEnvVariables} from "@/shared/_feat";
import {DateTime} from "luxon";

/** Authenticates a user and sets an HTTP-only JWT cookie. */
export async function postLoginUser(req: Request, res: Response): Promise<Response> {
    const userIp = fetchRequestIP(req);

    const data = req.validatedBody as UserLoginInput;
    if (!data) throw createHttpError(400, "Missing Request Data.");

    const {user, authHash} = await loginUser({data});
    const {issuedToken} = await createRefreshToken({userID: user._id, userIp})

    const {
        REFRESH_EXPIRY_DURATION,
        REFRESH_TOKEN_LIFETIME,
        CREDENTIALS_EXPIRY_DURATION,
        REQUIRE_SECURE_COOKIES,
    } = getEnvVariables();

    const refreshBy = DateTime.now().setZone("UTC").plus({minute: REFRESH_EXPIRY_DURATION}).toISO();
    const refreshTokenLife =  convertToMilliseconds({value: REFRESH_TOKEN_LIFETIME, from: "days"});
    const authTokenLife = convertToMilliseconds({value: CREDENTIALS_EXPIRY_DURATION, from: "minutes"});

    return res
        .status(200)
        .cookie("hasAuthToken", true, {secure: REQUIRE_SECURE_COOKIES, maxAge: authTokenLife})
        .cookie("refreshBy", refreshBy, {secure: REQUIRE_SECURE_COOKIES, maxAge: refreshTokenLife})
        .cookie("authToken", authHash, {httpOnly: true, secure: REQUIRE_SECURE_COOKIES, maxAge: authTokenLife})
        .cookie("refreshToken", issuedToken, {httpOnly: true, secure: REQUIRE_SECURE_COOKIES, maxAge: refreshTokenLife})
        .json(user);
}