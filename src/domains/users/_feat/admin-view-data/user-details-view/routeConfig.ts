/**
 * @fileoverview Defines the schema and types for the user details view route configuration.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";

/** Zod schema for validating user details view route parameters. */
export const UserDetailsViewRouteConfigSchema = z.object({
    userID: ObjectIdSchema,
});

/** Type definition for the user details view route configuration. */
export type UserDetailsViewRouteConfig = z.infer<typeof UserDetailsViewRouteConfigSchema>;