import { z } from "zod";
import { type RoleTypeCastCategoryEnumSchema, RoleTypeCrewCategoryEnumSchema } from "./RoleTypeCategory.schema.js";

/**
 * TypeScript type representing a valid cast role category.
 *
 * @remarks
 * Inferred from {@link RoleTypeCastCategoryEnumSchema}.
 * Values are restricted to the constants defined in
 * `RoleTypeCastCategoryConstant`, e.g., "Actor", "Voice Actor", etc.
 */
export type RoleTypeCastCategory = z.infer<typeof RoleTypeCastCategoryEnumSchema>;

/**
 * TypeScript type representing a valid crew role category.
 *
 * @remarks
 * Inferred from {@link RoleTypeCrewCategoryEnumSchema}.
 * Values are restricted to the constants defined in
 * `RoleTypeCrewCategoryConstant`, e.g., "Producer", "Director", etc.
 */
export type RoleTypeCrewCategory = z.infer<typeof RoleTypeCrewCategoryEnumSchema>;
