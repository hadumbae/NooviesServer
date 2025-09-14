import {z} from "zod";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {RoleTypeDepartmentEnumSchema} from "./RoleTypeDepartment.enum.js";

/**
 * Zod schema for validating input when creating or updating a RoleType.
 *
 * Ensures that all provided fields meet required validation rules:
 *
 * - `roleName`:
 *   - Required.
 *   - String up to 150 characters.
 *
 * - `department`:
 *   - Required.
 *   - Must be one of the allowed department values defined in
 *     {@link RoleTypeDepartmentEnumSchema}.
 *
 * - `description`:
 *   - Optional.
 *   - String up to 1000 characters if provided.
 *
 * This schema is intended for validating **client input** in API requests
 * (e.g., when creating or updating a role type).
 */
export const RoleTypeInputSchema = z.object({
    /** Role type name (required, max 150 characters). */
    roleName: RequiredStringSchema
        .max(150, {message: "Must be 150 characters or less."}),

    /** Department the role belongs to (required). */
    department: RoleTypeDepartmentEnumSchema,

    /** Optional description of the role (max 1000 characters). */
    description: RequiredStringSchema
        .max(1000, {message: "Must be 1000 characters or less."})
        .optional(),
}).describe("Role Type Input");
