import {z} from "zod";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {RoleTypeDepartmentEnumSchema} from "./RoleTypeDepartment.enum.js";

/**
 * Zod schema for validating input when creating or updating a RoleType.
 *
 * This schema ensures the following:
 * - `roleName`: required string, maximum 1000 characters.
 * - `department`: required, must be a valid value defined in {@link RoleTypeDepartmentEnumSchema}.
 * - `description`: optional string, maximum 1000 characters, can be `null`.
 *
 * Validation messages are provided for each field to guide user input.
 */
export const RoleTypeInputSchema = z.object({
    roleName: RequiredStringSchema
        .max(1000, { message: "Must be 1000 characters or less." }),

    department: RoleTypeDepartmentEnumSchema,

    description: RequiredStringSchema
        .max(1000, { message: "Must be 1000 characters or less." })
        .optional()
        .transform(value => typeof value === "string" ? value : undefined ),
});