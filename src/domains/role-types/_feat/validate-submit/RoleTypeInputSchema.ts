/**
 * @fileoverview Zod schemas for validating movie role type input data.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {RoleTypeDepartmentSchema} from "@/domains/role-types/_validation/schema/RoleTypeDepartmentSchema";
import {
    RoleTypeCastCategorySchema,
    RoleTypeCrewCategorySchema
} from "@/domains/role-types/_validation/schema/RoleTypeCategorySchema";

const RoleTypeBaseSchema = z.object({
    roleName: NonEmptyStringSchema.max(150, {message: "Max. 150 Chars"}),
    department: RoleTypeDepartmentSchema,
    description: NonEmptyStringSchema.max(1000, {message: "Max. 1000 Chars"}).optional(),
});

const RoleTypeCrewSchema = RoleTypeBaseSchema.extend({
    department: z.literal("CREW"),
    category: RoleTypeCrewCategorySchema,
});

const RoleTypeCastSchema = RoleTypeBaseSchema.extend({
    department: z.literal("CAST"),
    category: RoleTypeCastCategorySchema,
});

/** Discriminated union schema for validating cast or crew role type inputs. */
export const RoleTypeInputSchema = z.discriminatedUnion(
    "department",
    [RoleTypeCrewSchema, RoleTypeCastSchema],
);

/** Input data for creating or updating a role type. */
export type RoleTypeInputData = z.infer<typeof RoleTypeInputSchema>;