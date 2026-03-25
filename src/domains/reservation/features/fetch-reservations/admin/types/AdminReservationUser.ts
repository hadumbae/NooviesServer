/**
 * @file Specialized TypeScript type for representing a User within an Administrative Reservation context.
 * @filename AdminReservationUser.ts
 */

import type {UserSchemaFields} from "@models/User.types.js";

/**
 * A narrowed projection of the {@link UserSchemaFields} tailored for administrative reservation views.
 */
export type AdminReservationUser = Pick<UserSchemaFields, "_id" | "name" | "email">;