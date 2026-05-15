/**
 * @fileoverview Zod schema for validating an array of movie genre identifiers.
 */

import {z} from "zod";
import {ObjectIdStringSchema} from "@shared/schema/mongoose/ObjectIdStringSchema";

/** Zod schema that validates an array of MongoDB ObjectId strings for movie genres. */
export const MovieGenreIDsSchema = z.array(
    ObjectIdStringSchema,
    {required_error: "Required.", invalid_type_error: "Must be an array of genre IDs."},
);

/** Type definition for an array of movie genre IDs. */
export type MovieGenreIDs = z.infer<typeof MovieGenreIDsSchema>;