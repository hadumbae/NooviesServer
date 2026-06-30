/**
 * @fileoverview Zod schema and type definitions for movie role departments.
 */

import {z} from "zod";
import {
    RoleTypeDepartmentConstant
} from "@/domains/roleType/validation/constants/RoleTypeDepartmentConstant";

/** Zod schema for validating department values against RoleTypeDepartmentConstant. */
export const RoleTypeDepartmentSchema = z.enum(
    RoleTypeDepartmentConstant,
    { message: "Invalid Value For Department." },
);

/** TypeScript type representing all possible valid department values. */
export type RoleTypeDepartment = z.infer<typeof RoleTypeDepartmentSchema>;
