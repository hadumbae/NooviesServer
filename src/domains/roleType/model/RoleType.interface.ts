import type { RoleTypeDepartmentEnum } from "../schemas/RoleTypeDepartment.enum.js";
import { Types } from "mongoose";
import type { RoleTypeCastCategory, RoleTypeCrewCategory } from "../schemas/RoleTypeCategory.types.js";

/**
 * Represents a role type within a movie.
 *
 * @remarks
 * This interface is used to strongly type Mongoose documents
 * that describe different roles in a film production, including
 * both cast and crew positions.
 */
export default interface IRoleType {
    /** Unique identifier for the role (MongoDB ObjectId). */
    readonly _id: Types.ObjectId;

    /**
     * The specific name of the role.
     *
     * Examples: `"Director"`, `"Executive Producer"`, `"Lead Actor"`.
     * This is free text and allows for granular role names.
     */
    roleName: string;

    /**
     * Broad category of the role.
     *
     * Uses the enum-like types {@link RoleTypeCastCategory} and
     * {@link RoleTypeCrewCategory} to normalize roles into high-level
     * categories for filtering and grouping.
     *
     * Examples:
     * - Cast: `"Actor"`, `"Voice Actor"`, `"Stunt Performer"`
     * - Crew: `"Producer"`, `"Director"`, `"Cinematography"`
     */
    category: RoleTypeCastCategory | RoleTypeCrewCategory;

    /**
     * The department this role belongs to.
     *
     * Restricted to values defined in {@link RoleTypeDepartmentEnum},
     * which is `"CREW"` | `"CAST"`.
     */
    department: RoleTypeDepartmentEnum;

    /**
     * Optional description of the role’s purpose or duties.
     *
     * Must be 1–1000 characters if provided.
     */
    description?: string;
}
