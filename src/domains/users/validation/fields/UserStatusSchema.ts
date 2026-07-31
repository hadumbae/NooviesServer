/**
 * @fileoverview Validation schemas and types for user status lifecycle values.
 */

import {z} from "zod";
import {UserStatusConstant} from "@/domains/users/_const";

/** Zod schema validating that a value matches a recognized user status. */
export const UserStatusSchema = z.enum(UserStatusConstant, {
    required_error: "Required.",
    invalid_type_error: `Must be a valid user status. Accepted: ${UserStatusConstant.join(", ")}`,
});

/** TypeScript type inferred from the UserStatusSchema. */
export type UserStatus = z.infer<typeof UserStatusSchema>;