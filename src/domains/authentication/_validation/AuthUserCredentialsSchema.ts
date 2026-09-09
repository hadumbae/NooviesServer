/**
 * @fileoverview Zod schema and TypeScript type definition for authenticated user credentials, including the session token.
 */

import {z} from "zod";
import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";
import {AuthTokenPayloadSchema} from "@/domains/authentication/_validation/AuthTokenPayloadSchema";

/** Zod validation schema for user credentials containing token payload and session token. */
export const AuthUserCredentialsSchema = AuthTokenPayloadSchema.extend({
    token: StringValueSchema,
});

/** Represents user authentication credentials derived from AuthUserCredentialsSchema. */
export type AuthUserCredentials = z.infer<typeof AuthUserCredentialsSchema>;