/**
 * @fileoverview Utility function for revoking all active refresh tokens associated with a given user.
 */

import {Types} from "mongoose";
import {RefreshToken} from "@/domains/authentication";

type ClearConfig = {
    userId: Types.ObjectId;
}

/** Revokes all refresh tokens for a specified user ID. */
export async function clearRefreshTokens(
    {userId}: ClearConfig,
): Promise<void> {
    await RefreshToken.updateMany({user: userId}, {$set: {revoked: true}});
}