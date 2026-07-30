/** @fileoverview Handler for fetching lean role type data. */

import {RoleTypeModel, type RoleTypeSchemaFields} from "@/domains/role-types";
import type {FetchLeanDataConfig} from "@/domains/ui-inputs/handlers/fetchLeanDataConfig";

/** Fetches role types with a limited selection of fields for UI inputs. */
export async function fetchRoleTypesForInputs(
    {filters, sorts}: FetchLeanDataConfig<RoleTypeSchemaFields> = {}
): Promise<RoleTypeSchemaFields[]> {
    return RoleTypeModel
        .find(filters ?? {})
        .sort(sorts)
        .select("_id roleName department category")
        .lean();
}