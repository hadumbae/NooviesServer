/**
 * @fileoverview Defines the route parameter schema for user management operations.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";

/** Zod validation schema for the manage user route parameters. */
export const ManageUserRouteConfigSchema = z.object({
    userId: ObjectIdSchema,
});

/** Type definition for the manage user route parameters. */
export type ManageUserRouteConfig = z.infer<typeof ManageUserRouteConfigSchema>;