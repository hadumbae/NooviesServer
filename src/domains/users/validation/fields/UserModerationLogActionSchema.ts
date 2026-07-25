/**
 * @fileoverview Zod validation schema and type for user moderation log codes.
 */

import {z} from "zod";
import {UserModerationLogActionConstant} from "@/domains/users";
import {ZodEnumParamHandler} from "@/shared/_feat";

/** Zod schema for validating moderation log action codes. */
export const UserModerationLogActionSchema = z.enum(UserModerationLogActionConstant, ZodEnumParamHandler({
    invalidType: "Must be a valid log action string.",
    invalidValue: "Must be a valid log action.",
}));

/** Type definition for a valid user moderation log code. */
export type UserModerationLogAction = z.infer<typeof UserModerationLogActionSchema>;