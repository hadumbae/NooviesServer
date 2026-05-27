/**
 * @fileoverview Zod schema for route configurations requiring a single object identifier.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";

/** Zod validation schema for an object containing a MongoDB ObjectId. */
export const IDRouteConfigSchema = z.object({
    _id: ObjectIdSchema,
});

/** Type definition for route configurations containing an identifier. */
export type IDRouteConfig = z.infer<typeof IDRouteConfigSchema>;