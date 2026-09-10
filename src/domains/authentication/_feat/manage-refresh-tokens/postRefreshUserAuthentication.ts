/**
 * @fileoverview Express route controller for handling user authentication session refreshes and cookie rotation.
 */

import type {Request, Response} from 'express'
import {
    updateUserAuthCredentials
} from "@/domains/authentication/_feat/manage-refresh-tokens/updateUserAuthCredentials";
import {fetchRequestUser} from "@/shared/utility/request/fetchRequestUser";
import {fetchRequestAuthentication} from "@/shared/_feat/request-data";
import {convertToMilliseconds, getEnvVariables} from "@/shared/_feat";
import {DateTime} from "luxon";
import {fetchRequestIP} from "@/shared/utility/request/fetchRequestIP";

/** Handles session token rotation and updates authentication cookies for the requesting user. */
export async function postRefreshUserAuthentication(req: Request, res: Response) {
    const {
        REFRESH_EXPIRY_DURATION,
        REFRESH_TOKEN_LIFETIME,
        CREDENTIALS_EXPIRY_DURATION,
        REQUIRE_SECURE_COOKIES,
    } = getEnvVariables();

    const {refreshToken: incomingToken} = fetchRequestAuthentication(req);
    const ipAddress = fetchRequestIP(req);

    const {user, issuedToken, authHash} = await updateUserAuthCredentials({
        user: await fetchRequestUser(req),
        incomingToken,
        ipAddress
    });

    const refreshBy = DateTime.now().plus({minute: REFRESH_EXPIRY_DURATION}).toJSDate();
    const refreshTokenLife =  convertToMilliseconds({value: REFRESH_TOKEN_LIFETIME, from: "days"});
    const authTokenLife = convertToMilliseconds({value: CREDENTIALS_EXPIRY_DURATION, from: "minutes"});

    return res
        .cookie("hasAuthToken", true, {secure: REQUIRE_SECURE_COOKIES, maxAge: authTokenLife})
        .cookie("refreshBy", refreshBy, {secure: REQUIRE_SECURE_COOKIES, maxAge: refreshTokenLife})
        .cookie("authToken", authHash, {httpOnly: true, secure: REQUIRE_SECURE_COOKIES, maxAge: authTokenLife})
        .cookie("refreshToken", issuedToken, {httpOnly: true, secure: REQUIRE_SECURE_COOKIES, maxAge: refreshTokenLife})
        .json(user);
}