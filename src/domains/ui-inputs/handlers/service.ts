/** @fileoverview Services for fetching lean, optimized subsets of movie, person, and role type data. */

import type {FetchLeanDataConfig} from "@/domains/ui-inputs/handlers/service.types";
import type {MovieSchemaFields} from "@/domains/movies/_models/movie/Movie.types";
import {Movie} from "@/domains/movies/_models/movie/Movie.model";
import type {RoleTypeSchemaFields} from "@/domains/role-types/_models/RoleType.types";
import {RoleTypeModel} from "@/domains/role-types/_models/RoleType.model";
import {Person, type PersonSchemaFields} from "@/domains/persons/_models/person";

/** Retrieves a list of lean movie documents filtered and sorted by the provided configuration. */
export async function fetchLeanMovies(
    {filters, sorts}: FetchLeanDataConfig<MovieSchemaFields> = {}
): Promise<MovieSchemaFields[]> {
    return Movie
        .find(filters ?? {})
        .sort(sorts)
        .select("_id name releaseDate isReleased")
        .lean();
}

/** Retrieves a list of lean person documents filtered and sorted by the provided configuration. */
export async function fetchLeanPersons(
    {filters, sorts}: FetchLeanDataConfig<PersonSchemaFields> = {}
): Promise<PersonSchemaFields[]> {
    return Person
        .find(filters ?? {})
        .sort(sorts)
        .select("_id name dob nationality")
        .lean();
}

/** Retrieves a list of lean role type documents filtered and sorted by the provided configuration. */
export async function fetchLeanRoleTypes(
    {filters, sorts}: FetchLeanDataConfig<RoleTypeSchemaFields> = {}
): Promise<RoleTypeSchemaFields[]> {
    return RoleTypeModel
        .find(filters ?? {})
        .sort(sorts)
        .select("_id roleName department category")
        .lean();
}