import { z } from "zod";
import { RequiredStringSchema } from "../../../shared/schema/strings/RequiredStringSchema.js";
import { RoleTypeDepartmentEnumSchema } from "./RoleTypeDepartment.enum.js";
import { RoleTypeCastCategoryEnumSchema, RoleTypeCrewCategoryEnumSchema } from "./RoleTypeCategory.schema.js";

/**
 * Base Zod schema for a movie role type.
 *
 * @remarks
 * Contains fields shared by both cast and crew roles:
 * - `roleName`: required, trimmed string up to 150 characters
 * - `department`: must be either "CAST" or "CREW"
 * - `description`: optional, up to 1000 characters
 */
const RoleTypeBaseSchema = z.object({
    /** Role type name. Required string, max 150 characters. */
    roleName: RequiredStringSchema
        .max(150, { message: "Must be 150 characters or less." }),

    /** Department the role belongs to. Required. */
    department: RoleTypeDepartmentEnumSchema,

    /** Optional description of the role. Max 1000 characters. */
    description: RequiredStringSchema
        .max(1000, { message: "Must be 1000 characters or less." })
        .optional(),
});

/**
 * Zod schema for crew roles.
 *
 * @remarks
 * Extends the base schema and enforces:
 * - `department` must be `"CREW"`
 * - `category` must be one of {@link RoleTypeCrewCategoryEnumSchema}
 */
const RoleTypeCrewSchema = RoleTypeBaseSchema.extend({
    department: z.literal("CREW"),
    category: RoleTypeCrewCategoryEnumSchema,
});

/**
 * Zod schema for cast roles.
 *
 * @remarks
 * Extends the base schema and enforces:
 * - `department` must be `"CAST"`
 * - `category` must be one of {@link RoleTypeCastCategoryEnumSchema}
 */
const RoleTypeCastSchema = RoleTypeBaseSchema.extend({
    department: z.literal("CAST"),
    category: RoleTypeCastCategoryEnumSchema,
});

/**
 * Input schema for role types (cast or crew) using a discriminated union.
 *
 * @remarks
 * - The `department` field is used as the discriminator.
 * - Ensures correct validation of `category` based on `department`.
 * - Accepts either {@link RoleTypeCrewSchema} or {@link RoleTypeCastSchema}.
 */
export const RoleTypeInputSchema = z.discriminatedUnion(
    "department",
    [RoleTypeCrewSchema, RoleTypeCastSchema],
);
