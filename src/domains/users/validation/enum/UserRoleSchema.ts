/**
 * @fileoverview Zod schema and type definitions for user roles.
 */

import { z } from "zod";
import {UserRoleConstant} from "@/domains/users/validation/enum/UserRoleConstant";

/** Zod schema for validating user roles against predefined constants. */
export const UserRoleSchema = z.enum(UserRoleConstant, {
    required_error: "Required.",
    invalid_type_error: `Must be a valid user role. Accepted: ${UserRoleConstant.join(", ")}`,
});

/** Type representing a valid user role string. */
export type UserRole = z.infer<typeof UserRoleSchema>;
