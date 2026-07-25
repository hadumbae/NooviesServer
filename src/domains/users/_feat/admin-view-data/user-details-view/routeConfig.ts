/**
 * @fileoverview Defines the schema and types for the user details view route configuration.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";
import {preprocessToNumber} from "@/shared/_feat";
import {PositiveIntegerSchema} from "@/shared/_schema/numbers/numbers/PositiveIntegerSchema";

/** Zod schema for validating user details view route parameters. */
export const UserDetailsViewRouteConfigSchema = z.object({
    userID: ObjectIdSchema,
    reservationCount: preprocessToNumber(PositiveIntegerSchema.optional()).optional(),
    reviewCount: preprocessToNumber(PositiveIntegerSchema.optional()).optional(),
});

/** Type definition for the user details view route configuration. */
export type UserDetailsViewRouteConfig = z.infer<typeof UserDetailsViewRouteConfigSchema>;