import {z} from "zod";
import RoleTypeConstant from "../../constants/RoleTypeConstant.js";

/**
 * A Zod schema that validates whether a string matches one of the predefined role types.
 *
 * @remarks
 * - Based on {@link RoleTypeConstant}, which should be a constant array of allowed role type strings.
 * - Uses `z.enum()` to strictly enforce that the value must match one of the enum entries.
 * - Throws `"Invalid Role Type Enum."` if the input does not match any allowed value.
 * - Commonly used for user role validation (e.g., "admin", "editor", "viewer", etc.).
 *
 * @example
 * ```ts
 * RoleTypeEnumSchema.parse("admin"); // ✅ Valid
 * RoleTypeEnumSchema.parse("guest"); // ❌ Throws "Invalid Role Type Enum."
 * ```
 */
export const RoleTypeEnumSchema = z.enum(RoleTypeConstant, {message: "Invalid Role Type Enum."});

/**
 * A TypeScript type representing a valid role type string.
 *
 * @remarks
 * - Inferred from {@link RoleTypeEnumSchema}.
 * - Useful for ensuring role-related variables or API payloads conform to expected values.
 */
export type RoleTypeEnum = z.infer<typeof RoleTypeEnumSchema>;