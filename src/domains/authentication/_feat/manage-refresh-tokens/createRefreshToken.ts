/**
 * @fileoverview Utility function for generating and persisting user refresh tokens.
 */

import crypto from "crypto";
import {Types} from "mongoose";
import {RefreshToken, type RefreshTokenSchemaFields} from "@/domains/authentication";
import {DateTime} from "luxon";
import {getEnvVariables} from "@/shared/_feat";
import type {IpString} from "@/shared/schema/strings/IPSchema";

type CreateConfig = {
    userIp?: IpString;
    userID: Types.ObjectId;
    family?: string;
}

type TokenReturns = {
    refreshToken: RefreshTokenSchemaFields;
    issuedToken: string;
}

/** Creates and saves a new refresh token for a given user and IP address. */
export async function createRefreshToken(
    {userIp, userID, family}: CreateConfig
): Promise<TokenReturns> {
    const {REFRESH_TOKEN_LIFETIME} = getEnvVariables();

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const tokenFamily = family ?? crypto.randomUUID();
    const expiresAt = DateTime.now().plus({day: REFRESH_TOKEN_LIFETIME}).toJSDate();

    const data = new RefreshToken({
        ip: userIp,
        family: tokenFamily,
        user: userID,
        tokenHash,
        expiresAt,
    });

    return {
        refreshToken: await data.save(),
        issuedToken: rawToken,
    };
}