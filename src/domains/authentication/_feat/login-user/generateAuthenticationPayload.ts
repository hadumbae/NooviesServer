/**
 * @fileoverview Utility for constructing and signing the authenticated user session payload and token.
 */

import {AuthTokenPayloadSchema, type AuthUserCredentials} from "@/domains/authentication";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import type {UserSchemaFields} from "@/domains/users";
import {getEnvVariables} from "@/shared/_feat";

type TokenConfig = {
    user: UserSchemaFields;
}

/** Generates a validated authentication payload along with a signed JWT session token. */
export function generateAuthenticationPayload(
    {user: {_id, roles, name, email, uniqueCode, status}}: TokenConfig
): AuthUserCredentials {
    const {CREDENTIALS_EXPIRY_DURATION} = getEnvVariables();

    const {data: payload, success} = AuthTokenPayloadSchema.safeParse({
        isAdmin: roles.includes("ADMIN"),
        user: {_id, roles, name, email, uniqueCode, status},
        status,
    });

    if (!success) {
        throw createHttpError(500, "Unable to generate credentials. Please try again.");
    }

    const authHash = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: `${CREDENTIALS_EXPIRY_DURATION}m`});

    return {
        ...payload,
        authHash,
    }
}