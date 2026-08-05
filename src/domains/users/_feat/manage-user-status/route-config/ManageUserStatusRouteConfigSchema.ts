/**
 * @fileoverview Zod schema and type definition for route configuration parameters when managing user status.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";

/** Zod schema for validating route parameters when managing user status. */
export const ManageUserStatusRouteConfigSchema = z.object({
    userId: ObjectIdSchema,
});

/** Route configuration parameters for managing user status inferred from ManageUserStatusRouteConfigSchema. */
export type ManageUserStatusRouteConfig = z.infer<typeof ManageUserStatusRouteConfigSchema>;