/**
 * @fileoverview Utility for extracting and validating authentication state from an Express request object.
 */

import type {Request} from "express";
import createHttpError from "http-errors";
import {
    type RequestAuthenticationData,
    RequestAuthenticationSchema
} from "@/shared/_feat/request-data/RequestAuthenticationSchema";

/** Extracts and validates request-scoped authentication data, throwing a 401 error if invalid. */
export function fetchRequestAuthentication(req: Request): RequestAuthenticationData {
    const data = {
        authUserID: req.authUserID,
        authUserIsAdmin: req.authUserIsAdmin,
        authUserStatus: req.authUserStatus,
        isLoggedIn: req.isLoggedIn,
        authToken: req.authToken,
        refreshToken: req.refreshToken,
    };

    const {success, data: parsed} = RequestAuthenticationSchema.safeParse(data);

    if (!success) {
        throw createHttpError(401, "Invalid request authentication.");
    }

    return parsed;
}