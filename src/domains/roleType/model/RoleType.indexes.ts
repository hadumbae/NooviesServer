/**
 * @fileoverview Defines database indexes for the RoleType schema to ensure data integrity.
 */

import {RoleTypeSchema} from "@domains/roleType/model/RoleType.schema";

/**
 * Ensures that the combination of role name and department is unique.
 */
RoleTypeSchema.index({roleName: 1, department: 1}, {unique: true});
