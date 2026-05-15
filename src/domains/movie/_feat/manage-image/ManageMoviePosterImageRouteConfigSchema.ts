/**
 * @fileoverview Defines the schema and type for the movie poster image management route configuration.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";

/** Zod validation schema for the movie poster image route configuration. */
export const ManageMoviePosterImageRouteConfigSchema = z.object({
    _id: ObjectIdSchema,
});

/** Type definition for the movie poster image route configuration. */
export type ManageMoviePosterImageRouteConfig = z.infer<typeof ManageMoviePosterImageRouteConfigSchema>;