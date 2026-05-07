/**
 * @fileoverview Zod schema and type definition for validating route configuration parameters when managing genre images.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";

/**
 * Zod schema for validating route configuration when managing genre images.
 */
export const ManageGenreImageRouteConfigSchema = z.object({
    _id: ObjectIdSchema,
});

/**
 * Inferred TypeScript type for the validated route configuration when managing genre images.
 */
export type ManageGenreImageRouteConfig = z.infer<typeof ManageGenreImageRouteConfigSchema>;