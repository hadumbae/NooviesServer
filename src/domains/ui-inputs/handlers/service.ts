/** @fileoverview Services for fetching lean, optimized subsets of movie, person, and role type data. */

import type {FetchLeanDataConfig} from "@domains/ui-inputs/handlers/service.types";
import type {MovieSchemaFields} from "@domains/movie/model/Movie.types";
import MovieModel from "@domains/movie/model/Movie.model";
import type IRoleType from "@domains/roleType/model/RoleType.interface";
import RoleTypeModel from "@domains/roleType/model/RoleType.model";
import {Person, type PersonSchemaFields} from "@domains/person/model";

/** Retrieves a list of lean movie documents filtered and sorted by the provided configuration. */
export async function fetchLeanMovies(
    {filters, sorts}: FetchLeanDataConfig<MovieSchemaFields> = {}
): Promise<MovieSchemaFields[]> {
    return MovieModel
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
    {filters, sorts}: FetchLeanDataConfig<IRoleType> = {}
): Promise<IRoleType[]> {
    return RoleTypeModel
        .find(filters ?? {})
        .sort(sorts)
        .select("_id roleName department category")
        .lean();
}