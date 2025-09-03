import {z} from "zod";
import RoleTypeDepartmentConstant from "../constants/RoleTypeDepartmentConstant.js";

/**
 * Zod schema for validating department values in movie roles.
 *
 * Ensures that only values defined in {@link RoleTypeDepartmentConstant}
 * are accepted at runtime. If an invalid value is provided,
 * validation fails with the message: "Invalid Value For Department."
 */
export const RoleTypeDepartmentEnumSchema = z.enum(
    RoleTypeDepartmentConstant,
    { message: "Invalid Value For Department." },
);

/**
 * TypeScript type representing all possible valid department values.
 *
 * Equivalent to: `"CREW" | "CAST"`
 */
export type RoleTypeDepartmentEnum = z.infer<typeof RoleTypeDepartmentEnumSchema>;
