/**
 * @fileoverview Zod schema for route configuration when managing a specific customer reservation.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";
import {
    ManageCustomerRouteConfigSchema
} from "@/domains/customer/_feat/customer-details/schema/route-config/ManageCustomerRouteConfigSchema";

/** Schema for customer reservation management route parameters. */
export const ManageCustomerReservationRouteConfigSchema = ManageCustomerRouteConfigSchema.extend({
    reservationId: ObjectIdSchema,
});

/** Type definition for customer reservation management route parameters. */
export type ManageCustomerReservationRouteConfig = z.infer<typeof ManageCustomerReservationRouteConfigSchema>;