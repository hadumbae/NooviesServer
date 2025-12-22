import { z } from "zod";
import UserRoleConstant from "../../constants/UserRoleConstant.js";

/**
 * Zod schema for validating user roles.
 *
 * Ensures a value is one of the predefined roles in `UserRoleConstant`.
 * Provides custom error messages for missing or invalid values.
 *
 * @example
 * ```ts
 * UserRoleEnumSchema.parse("USER"); // ✅ valid
 * UserRoleEnumSchema.parse("MODERATOR"); // ❌ throws validation error
 * ```
 */
export const UserRoleEnumSchema = z.enum(UserRoleConstant, {
    required_error: "Required.",
    invalid_type_error: `Must be a valid user role. Accepted: ${UserRoleConstant.join(", ")}`,
});

/**
 * Type representing a valid user role.
 *
 * Equivalent to `"USER" | "ADMIN"` based on `UserRoleConstant`.
 */
export type UserRole = z.infer<typeof UserRoleEnumSchema>;
