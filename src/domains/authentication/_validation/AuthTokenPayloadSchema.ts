/**
 * @fileoverview Zod schema and TypeScript type definition for JWT authentication token payloads.
 */

import {z} from "zod";
import {AuthUserSchema} from "@/domains/authentication/_validation/AuthUserSchema";
import {BooleanValueSchema} from "@/shared/_schema/booleans/BooleanValueSchema";
import {UserStatusSchema} from "@/domains/users";

/** Zod validation schema for JWT authentication token payloads. */
export const AuthTokenPayloadSchema = z.object({
    user: AuthUserSchema,
    isAdmin: BooleanValueSchema,
    status: UserStatusSchema,
});

/** Represents the decoded authentication token payload derived from AuthTokenPayloadSchema. */
export type AuthTokenPayload = z.infer<typeof AuthTokenPayloadSchema>;