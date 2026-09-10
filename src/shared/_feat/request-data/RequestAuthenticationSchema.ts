/**
 * @fileoverview Zod schema and TypeScript type definition for validating request-scoped authentication context.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";
import {BooleanValueSchema} from "@/shared/_schema/booleans/BooleanValueSchema";
import {UserStatusSchema} from "@/domains/users";
import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";
import {RequestIpSchema} from "@/shared/schema/request/RequestIpSchema";

/** Zod validation schema for request-scoped authentication data properties. */
export const RequestAuthenticationSchema = z.object({
    ip: RequestIpSchema,
    authUserID: ObjectIdSchema,
    authUserIsAdmin: BooleanValueSchema,
    authUserStatus: UserStatusSchema,
    isLoggedIn: BooleanValueSchema,
    authToken: StringValueSchema,
    refreshToken: StringValueSchema,
});

/** Represents validated authentication data attached to the request context. */
export type RequestAuthenticationData = z.infer<typeof RequestAuthenticationSchema>;