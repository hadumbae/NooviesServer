/**
 * @fileoverview Validation schemas and types for route configurations managing user suspensions.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";

/** Zod schema validating the parameters required for the user suspension management route. */
export const ManageUserSuspensionRouteConfigSchema = z.object({
    userId: ObjectIdSchema,
});

/** TypeScript type inferred from the ManageUserSuspensionRouteConfigSchema. */
export type ManageUserSuspensionRouteConfig = z.infer<typeof ManageUserSuspensionRouteConfigSchema>;