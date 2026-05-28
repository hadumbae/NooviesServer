/**
 * @fileoverview Defines the schema for validating customer review identifiers in route parameters.
 */

import { z } from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";

/** Zod schema for validating the reviewID route parameter. */
export const CustomerReviewIDRouteConfigSchema = z.object({
    reviewID: ObjectIdSchema,
});

/** Type definition for the customer review route configuration. */
export type CustomerReviewIDRouteConfig = z.infer<typeof CustomerReviewIDRouteConfigSchema>;