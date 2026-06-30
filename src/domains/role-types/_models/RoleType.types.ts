/**
 * @fileoverview Defines the core interface for role types within the system.
 */

import type {RoleTypeDepartment} from "@/domains/role-types/_validation/schema/RoleTypeDepartmentSchema";
import {Types} from "mongoose";
import type {BaseModel} from "@/shared/types/schema/BaseModel";
import type {RoleTypeCastCategory, RoleTypeCrewCategory} from "@/domains/role-types/_validation/schema/RoleTypeCategorySchema";

/** Represents a specific role definition and its classification metadata. */
export type RoleTypeSchemaFields = BaseModel & {
    readonly _id: Types.ObjectId;
    roleName: string;
    category: RoleTypeCastCategory | RoleTypeCrewCategory;
    department: RoleTypeDepartment;
    description?: string;
}
