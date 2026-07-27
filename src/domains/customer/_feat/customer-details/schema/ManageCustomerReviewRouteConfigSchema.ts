/**
 * @fileoverview Zod schema and type definition for managing customer review route configurations.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";
import {
    ManageCustomerRouteConfigSchema
} from "@/domains/customer/_feat/customer-details/schema/ManageCustomerRouteConfigSchema";

/** Zod schema for validating customer and review identifiers in route parameters. */
export const ManageCustomerReviewRouteConfigSchema = ManageCustomerRouteConfigSchema.extend({
    reviewId: ObjectIdSchema,
});

/** Type definition for the customer review route configuration. */
export type ManageCustomerReviewRouteConfig = z.infer<typeof ManageCustomerReviewRouteConfigSchema>;