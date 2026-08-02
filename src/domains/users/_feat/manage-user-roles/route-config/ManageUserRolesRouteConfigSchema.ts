/**
 * @fileoverview Validation schemas and types for route configurations managing user roles.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";

/** Zod schema validating the parameters required for the user role management route. */
export const ManageUserRolesRouteConfigSchema = z.object({
    userId: ObjectIdSchema,
});

/** TypeScript type inferred from the ManageUserRolesRouteConfigSchema. */
export type ManageUserRolesRouteConfig = z.infer<typeof ManageUserRolesRouteConfigSchema>;