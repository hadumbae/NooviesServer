/**
 * @fileoverview Utility for refreshing user session credentials and rotating refresh tokens.
 */

import crypto from "crypto";
import createHttpError from "http-errors";
import {RefreshToken} from "@/domains/authentication/_models/refresh-token";
import {generateAuthenticationPayload} from "@/domains/authentication/_feat/login-user";
import {createRefreshToken} from "@/domains/authentication/_feat/manage-refresh-tokens/createRefreshToken";
import type {IpString} from "@/shared/schema/strings/IPSchema";
import type {UserSchemaFields} from "@/domains/users";
import type {AuthUserCredentials} from "@/domains/authentication";

type UpdateConfig = {
    user: UserSchemaFields
    incomingToken: string;
    ipAddress?: IpString;
}

type UpdateReturns = AuthUserCredentials & {
    issuedToken: string;
}

/** Revokes the current refresh token and issues a new session payload and rotated token. */
export async function updateUserAuthCredentials(
    {user, ipAddress, incomingToken}: UpdateConfig
): Promise<UpdateReturns> {
    const incomingHashed = crypto.createHash("sha256").update(incomingToken).digest("hex");

    const staleToken = await RefreshToken.findOne({tokenHash: incomingHashed});
    if (!staleToken) throw createHttpError(401, "Invalid. Refresh Token Required.");

    if (!user._id.equals(staleToken.user)) {
        throw createHttpError(403, "Forbidden. Invalid Token Ownership.");
    }

    if (staleToken.revoked) {
        await RefreshToken.updateMany({family: staleToken.family}, {$set: {revoked: true}});
        throw createHttpError(403, "Forbidden. Token Already Revoked.");
    }

    staleToken.revoked = true;
    await staleToken.save();

    const authData = generateAuthenticationPayload({user});

    const {issuedToken} = await createRefreshToken({
        userID: staleToken.user,
        family: staleToken.family,
        userIp: ipAddress,
    });

    return {
        ...authData,
        issuedToken,
    }
}