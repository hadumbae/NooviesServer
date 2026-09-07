/**
 * @fileoverview Zod schema and type definitions for validating route parameters when managing movie images.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";

/** Schema for validating route parameters when managing movie poster or banner images. */
export const ManageMovieImageRouteConfigSchema = z.object({
    _id: ObjectIdSchema,
});

/** Type representing validated route parameters for movie image management. */
export type ManageMovieImageRouteConfig = z.infer<typeof ManageMovieImageRouteConfigSchema>;